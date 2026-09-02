/* ****************************************************************************
*	Copyright (c) Baosight Corporation 2011 . All Rights Reserved.
*  	MG2SM 梅钢二炼钢L3系统
*****************************************************************************
*  程序名称		: f_mmsm01_jud
*  程序描述		: 板坯自动判定处理
*  备注说明		:
*  创建日期     : 2014-04-08 weichenxiang
*  修改历史		: 2018-5-28 zhenglei(增加取样处理，优化出钢记号、外供坯处理)
*               : 2022-06-18 zhenglei 模型优化：
*                 1、增加新处理模块(炉次预处理模块(21))
*                 2、优化处理模块(混浇坯判定优化+产品用户判定+规格判定)
*                 3、增加传入参数，减少读表次数
*                 4、调用优化，减少调用函数及参数
*                 5、增加下线原因识别、垛位推荐预设定处理等
*                 6、引入质量等级控制
*                 7、增加分机、分流处置
*                 8、增加强制热送板坯判定处置
*                 9、重新优化改钢模块，增加对特殊要求的处理
*                 10、采用标准判定语句，统一识别方法，简化后期维护
*                 2023-05-28 panchen 代码转最新框架
*			... ...
* **************************************************************************** */

#include "stdafx.h"
#include <math.h>

BM2_FUNCTION_EXPORT

int f_qmbs_data_proc(CModel &ptmmsm01, CModel &ptqmts9ce, EIClass * bcls_ret);
int f_qmbs_chag_stno(CModel &ptmmsm01, CModel &ptqmts0x, EIClass * bcls_ret, CDbConnection * conn);
int f_qmbs_dest(CModel &ptmmsm01, EIClass * bcls_ret, CDbConnection * conn);
int f_mmsm99(EIClass * bcls_rec, EIClass * bcls_ret, CDbConnection * conn);

int f_qmbs_jud(CModel &ptmmsm01, EIClass * bcls_rec, EIClass * bcls_ret, CDbConnection * conn)
{
	CTracer log(__FUNCTION__);
	int doFlag = 0;
	CString sqlstr = " ";
	CString sqlstr_9ce = " ";
	CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
	int ret = 0;
	CString msg = " ";
	int blkNum = 0;
	int find_flag = 0;
	//str_tqmts22 * ptqmts22;
	CString n1 = "";
	CString slab_str1 = "";
	CString slab_str2 = "";
	CString slab_str3 = "";
	CString a1 = " ";
	CString a2 = " ";
	CString a3 = " ";
	CString st = " ";
	CString v_abn_code = " ";
	CString n2 = " ";
	CString mat_position_num = " ";
	CString v_pre_slab_no = " ";//组合的板坯号：pono-v_strand-n1
	CString v_pre_slab_no_1 = " ";//组合的板坯号：pono-v_strand-00
	int v_slab_hdscarf_flag = 0;//是否需要走清理标记，0未处置，1处置过
	CString v_strand = " ";
	int v_process_dispose = 0;//过程是否被处置过:0 (不满足)，1 (满足出钢钢记号+用户代码),2 (满足出钢钢记号+用户代码+最终用途)
	EIClass bcls_temp;//临时存储
	CString temp = " ";//临时变量，用于存储标准识别代码
	CString v_slab_deal_flag = " ";//临时变量

	/* ***** 程序表结构引用 ***** */

	/* ***** 宿主变量定义 ***** */
	CString v_mat_no = "";
	CString v_prec_st_no = "";
	//CString v_pre_slab_no[12] = "";
	CString v_yy_cause = " ";//YY判定原因
	CString v_pono = " ";
	CString v_slab_place_std = " ";
	int v_bslab_ext_pos = 600;
	int v_tslab_ext_pos = 600;
	CString v_archive_flag = " ";    /*成份交货标记*/
	CString v_slab_deal_type = "00";//模块代码
	CString v_slab_place_base_lg = " ";//炼钢内部充当基准
	CDbCommand cmd(conn);
	CDbCommand cmd_9ce(conn);
	CModel tqmts0x("TQMTS0X");
	CModel tqmts9ce("TQMTS9CE");
	CModel tqmts9ce_tmp("TQMTS9CE");
	try
	{
		//Log::Trace("", "", " **************f_mmsm01_jud() Begin（2022-07-04） *****************");
		v_mat_no = ptmmsm01["MAT_NO"];
		v_prec_st_no = ptmmsm01["PREC_ST_NO"];
		v_pono = ptmmsm01["PONO"];
		if (13 != strlen(v_mat_no))
		{
			Log::Trace("", "", " *************没有获取到板坯信息*****************");
			sprintf(s.msg, "没有获取到板坯信息");
			throw CApplicationException(-1, s.msg, log.Location);
		}
		Log::Trace("", "", "MAT_NO[{0}]", v_mat_no);
		Log::Trace("", "", "PREC_ST_NO[{0}]", ptmmsm01["PREC_ST_NO"]);
		Log::Trace("", "", "板坯类型 MAT_TYPE[{0}]", ptmmsm01["MAT_TYPE"]);
		Log::Trace("", "", "ORDER_NO[{0}]", ptmmsm01["ORDER_NO"]);
		Log::Trace("", "", "PONO[{0}]", ptmmsm01["PONO"]);
		Log::Trace("", "", "板坯位置 SLAB_PLACE_CODE[{0}]", ptmmsm01["SLAB_PLACE_CODE"]);
		Log::Trace("", "", "去向 MAT_DESTION[{0}]", ptmmsm01["MAT_DESTION"]);

		//全局变量初始化
		//初始化X1~X16
		ptmmsm01["FINISH_FLAG"] = " ";        //X1-处理标记
		ptmmsm01["FINISH_MODE"] = " ";        //X2-精整方法
		ptmmsm01["PLAN_CLEAN_FLAG"] = " ";        //X3-清理标记
		ptmmsm01["HDSCARF_MODE"] = " ";        //X4-清理方法
		//ptmmsm01["CHG_ST_NO_FLAG"] = " ";        //X5-改钢标记
		ptmmsm01["HOLD_CAUSE_CODE"] = " ";        //X6-封锁原因
		ptmmsm01["HOLD_REMARK"] = " ";        //X7-封锁注释
		ptmmsm01["DEFECT_CODE_F_1"] = " ";        //X8-缺陷代码
		ptmmsm01["DEFECT_CODE_F_2"] = " ";	       //X8-缺陷代码
		ptmmsm01["DEFECT_CODE_F_3"] = " ";        //X8-缺陷代码
		ptmmsm01["DEFECT_CODE_F_4"] = " ";        //X8-缺陷代码
		ptmmsm01["SURFACE_DECIDE_CODE"] = "1";        //X9-表面判定
		ptmmsm01["CLEAN_POS"] = "0000";        //X10-处理位置
		ptmmsm01["STOCK_PLACE_NO_TO"] = "9";        //X11-垛位推荐
		ptmmsm01["PCH_JUDGE_CODE"] = " ";		   //X12性能判定
		ptmmsm01["SLAB_SAMPLE_REQ"] = " ";		   //X13取样指示
		ptmmsm01["FIN_ST_NO"] = " ";        //X14出钢记号
		ptmmsm01["CHG_ST_NO_TYPE"] = " ";	       //X15改钢原因
		ptmmsm01["CHG_ST_NO_GRADE"] = " ";		   //X16质量处置等级
		ptmmsm01["SLAT_UNLADE_CAUSE"] = "80";		   //X17下线原因
		ptmmsm01["CHG_ST_NO_GRADE"] = "00";		   //质量处置等级默认为00。

		//准备TQMTS9CE表的sql
		sqlstr_9ce = " SELECT  *"
			"			FROM  TQMTS9CE"
			"			WHERE SLAB_DEAL_TYPE = @v_slab_deal_type"
			"           AND VALIDE_FLAG = '1' "
			"			ORDER  BY  SLAB_DEAL_FLAG, ASS_DIF_CODE, REC_CREATE_TIME DESC"
			;
		EIClass tqmts9ce_q;
		cmd_9ce.SetCommandText(sqlstr_9ce);

		//查询异常数据
		Log::Trace("", "", "ptmmsm01[MODEL_JUDGE] = {0}", ptmmsm01["MODEL_JUDGE"].ToString());
		Log::Trace("", "", "line = {0}", __LINE__);
		//读取工艺卡
		//20150120  增加查询板坯切割硫印试样采取基准代码  用于判断是否进行板坯是否进行低倍封锁
		sqlstr = " SELECT  SLAB_PLACE_STD, SLAB_CHECK_CODE, SLAB_HDSCARF_MODE, SLAB_SAMPLING_CODE_SUL, HARDNESS_GROUP, SLAB_DHCR_CODE, ARCHIVE_FLAG"
			"			   FROM  TQMTS0X"
			"			   WHERE  ST_NO = @v_prec_st_no";
		cmd.SetCommandText(sqlstr);
		cmd.Parameters.Set("v_prec_st_no", v_prec_st_no);
		cmd.ExecuteReader();
		if (cmd.Read())
		{
			cmd.Fetch(tqmts0x);
			v_archive_flag = tqmts0x["ARCHIVE_FLAG"];
		}
		else
		{
			sprintf(s.msg, "没有获取到TQMTS0X表的内容");
			throw CApplicationException(-1, s.msg, log.Location);
		}
		cmd.Close();
		Log::Trace("", "", "line = {0}", __LINE__);
		//读取连铸工艺卡
		sqlstr = " SELECT CAN_ASSIGN_FLAG, BSLAB_EXT_POS, TSLAB_EXT_POS, SLAB_PLACE_BASE_LG"
			"			   FROM TQMTS08"
			"			   WHERE ST_NO = @v_prec_st_no";
		cmd.SetCommandText(sqlstr);
		cmd.Parameters.Set("v_prec_st_no", v_prec_st_no);
		cmd.ExecuteReader();
		if (cmd.Read())
		{
			v_slab_place_std = cmd.GetString(1);
			v_bslab_ext_pos = cmd.GetInt32(2);
			v_tslab_ext_pos = cmd.GetInt32(3);
			v_slab_place_base_lg = cmd.GetString(4);
		}
		else
		{
			Log::Trace("", "", "没有获取到TQMTS08表的内容");
		}
		cmd.Close();
		Log::Trace("", "", "line = {0}", __LINE__);
		if (v_slab_place_std == " ")
			v_slab_place_std = tqmts0x["SLAB_PLACE_STD"];
		Log::Trace("", "", "line = {0}", __LINE__);
		if (v_slab_place_base_lg == " ")
			v_slab_place_base_lg = tqmts0x["SLAB_PLACE_STD"];

		Log::Trace("", "", "炼钢内部充当基准[{0}]BT预留控制基准[{1}]", v_slab_place_base_lg, v_slab_place_std);
		//如果工艺卡要求为必热送钢种，强制将板坯热送标记强制为2
		if (tqmts0x["SLAB_DHCR_CODE"].ToString() == "1")//1 : 必热送，不允许下线
			ptmmsm01["HOT_SEND_FLAG"] = "2";
		//借用scrap_remark字段传递出钢记号的制造标准信息
		if (tqmts0x["SLAB_DHCR_CODE"].ToString() != " ")
			ptmmsm01["SCRAP_REMARK"] = tqmts0x["SLAB_DHCR_CODE"];//热送基准
		else
			ptmmsm01["SCRAP_REMARK"] = "0";
		if (tqmts0x["HARDNESS_GROUP"].ToString() != " ")
			ptmmsm01["SCRAP_REMARK"] = ptmmsm01["SCRAP_REMARK"].ToString() + tqmts0x["HARDNESS_GROUP"].ToString();//硬度值
		else
			ptmmsm01["SCRAP_REMARK"] = ptmmsm01["SCRAP_REMARK"].ToString() + "00";//硬度值
		if (3 != strlen(ptmmsm01["SCRAP_REMARK"]))
			ptmmsm01["SCRAP_REMARK"] = "000";
		Log::Trace("", "", "传递的热送标记、硬度信息[{0}]", ptmmsm01["SCRAP_REMARK"]);
		//取板坯号的顺序号
		if (13 == ptmmsm01["MAT_NO"].ToString().GetLength())
		{
			n1 = ptmmsm01["MAT_NO"].ToString().SubstringNE(10, 2);
		}
		Log::Trace("", "", " 板坯顺序号n1[{0}]", n1);

		//板坯奇偶流处理 
		if ("1" == ptmmsm01["STRAND_NO"].ToString() || "3" == ptmmsm01["STRAND_NO"].ToString())
		{
			v_strand = "1";
		}
		else
		{
			v_strand = "2";
		}

		//--------------pono + v_strand + n1-----------------
		//用于对需要生产的某炉（pono）的设定板坯进行处置
		v_pre_slab_no = ptmmsm01["PONO"];//pono
		v_pre_slab_no = v_pre_slab_no + "-";//pono + "-"
		v_pre_slab_no = v_pre_slab_no + v_strand;//pono + v_strand
		v_pre_slab_no = v_pre_slab_no + "-";//pono  + v_strand + "-"
		v_pre_slab_no_1 = v_pre_slab_no;//pono
		v_pre_slab_no = v_pre_slab_no + n1;//pono-v_strand-n1
		v_pre_slab_no_1 = v_pre_slab_no_1 + "00";//pono-v_strand-00

		//--------------cc_mach_no + v_strand + n1-----------------
		//用于对需要生产的某炉（pono）的设定板坯进行处置
		slab_str1 = ptmmsm01["CC_MACH_NO"];//cc_mach_no
		slab_str1 = slab_str1.Trim();
		slab_str1 = slab_str1 + "-";
		slab_str1 = slab_str1 + v_strand;//cc_mach_no + v_strand
		slab_str1 = slab_str1 + "-";
		slab_str1 = slab_str1 + n1;//cc_mach_no + v_strand + n1
		//slab_str1[6] = '\0';
		slab_str1 = slab_str1.Trim();

		slab_str2 = "X-";
		slab_str2 = slab_str2 + v_strand;//cc_mach_no + v_strand
		slab_str2 = slab_str2 + "-";
		slab_str2 = slab_str2 + n1;//cc_mach_no + v_strand + n1
		//slab_str2[6] = '\0';
		slab_str2 = slab_str2.Trim();

		slab_str3 = "X-X-";
		slab_str3 = slab_str3 + n1;//cc_mach_no + v_strand + n1
		//slab_str3[6] = '\0';
		slab_str3 = slab_str3.Trim();

		Log::Trace("", "", "slab_str1[{0}]slab_str2[{1}]slab_str3[{2}]", slab_str1, slab_str2, slab_str3);

		//00：--------------制造标准处置(23)--------------------- 
		v_slab_deal_type = "23";
		cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
		tqmts9ce_q.Tables[0].Rows.Clear();
		cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
		tqmts9ce_tmp.Reset();
		Log::Trace("", "", " *************制造标准处理[{0}] = [{1}]*****************，查询条数{2}", v_slab_deal_type, tqmts0x["SLAB_HDSCARF_MODE"], tqmts9ce_q.Tables[0].Rows.get_Count());
		for (int i = 1; i < 10; i++)//可以设置9个标准，分别从1到9:辅助字段用于标准，位置字段用于分组号
		{
			if (i == 1)
				v_slab_deal_flag = ptmmsm01["MOLD_TYPE"];//结晶器类型
			else if (i == 2)
				v_slab_deal_flag = tqmts0x["SLAB_DHCR_CODE"];//热送基准
			else if (i == 5)
				v_slab_deal_flag = tqmts0x["SLAB_HDSCARF_MODE"];//清理标准
			else if (i == 6)
				v_slab_deal_flag = tqmts0x["SLAB_CHECK_CODE"];//检查标准
			else
				continue;//待定
			char temp_str[3] = " ";
			sprintf(temp_str, "%d", i);
			temp = temp_str;
			Log::Trace("", "", " *************制造标准处理(0)：[0]*****************", temp, v_slab_deal_flag);
			find_flag = 10;//"1"的优先级最高		
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
					&& temp == tqmts9ce["MAT_POSITION"].ToString()
					&& v_slab_deal_flag == tqmts9ce["ASS_DIF_CODE"].ToString()
					&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString()))
				{
					//判断1 -“板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “制造标准”与tqmts9ce["处置代码字段相同"] + 标准识别代码与tqmts9ce["辅助代码字段相同"]
					find_flag = 1;//"1"的优先级最高
					Log::Trace("", "", "制造标准判断=[{0}] - 1", (CString)i);
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if ("XX" == tqmts9ce["ST_NO"].ToString()
					&& temp == tqmts9ce["MAT_POSITION"].ToString()
					&& v_slab_deal_flag == tqmts9ce["ASS_DIF_CODE"].ToString()
					&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					|| "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString()))
				{
					//判断2 - “制造标准”与tqmts9ce["处置代码字段相同"] + 标准识别代码与tqmts9ce["辅助代码字段相同，不考虑出钢记号"]
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "制造标准判断=[{0}] - 2", (CString)i);
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				v_slab_hdscarf_flag = 1;//已经安排手清就不再做检查处置
			}
		}

		//01：--------------最终用户代码判断(18)--------------------
		if (ptmmsm01["FIN_CUST_CODE"].ToString().Trim() != "" && ptmmsm01["PREC_SLAB_NO"].ToString().Trim() != "" && ptmmsm01["ORDER_NO"].ToString().Trim() != "")
		{
			v_slab_deal_type = "18";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************最终用户代码处理[{0}]*****************", v_slab_deal_type);
			//用户代码+最终用途满足+出钢记号
			CString v_final_user_code = " ";
			CString v_final_user_code_1 = " ";

			v_final_user_code = ptmmsm01["FIN_CUST_CODE"];
			v_final_user_code = v_final_user_code + "-";
			v_final_user_code = v_final_user_code + ptmmsm01["APN"].ToString();//考虑最终用途

			v_final_user_code_1 = ptmmsm01["FIN_CUST_CODE"];
			v_final_user_code_1 = v_final_user_code_1 + "-0000";//不考虑最终用途

			Log::Trace("", "", "最终用户代码v_final_user_code = [0],v_final_user_code_1 = [1],查询条数[{2}]", v_final_user_code, v_final_user_code_1, tqmts9ce_q.Tables[0].Rows.get_Count());
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "18" && v_final_user_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断1 - 处置类别为18 + “最终用户代码+最终用途满足”与tqmts9ce["板坯位置字段相同"] + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同，不考虑板坯位置"]
					find_flag = 1;//"1"的优先级最高
					Log::Trace("", "", "最终用户代码处理1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "18" && v_final_user_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断2 - 处置类别为18 + “最终用户代码+最终用途满足”与tqmts9ce["板坯位置字段相同，不考虑出钢记号和板坯位置"]
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "最终用户代码处理2");
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "18" && v_final_user_code_1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断3 - 处置类别为18 + “最终用户代码+0000”与tqmts9ce["板坯位置字段相同"] + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同，不考虑板坯位置"]
					if (find_flag > 3)
					{
						find_flag = 3;
						Log::Trace("", "", "最终用户代码处理3");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "18" && v_final_user_code_1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == "XX" && "X" == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断3 - 处置类别为18 + “用户代码+0000”与tqmts9ce. 板坯位置字段相同，不考虑出钢记号和板坯位置
					if (find_flag > 4)
					{
						find_flag = 4;
						Log::Trace("", "", "最终用户代码处理4");
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				v_process_dispose = 1;//后续不考虑钢种要求
				v_slab_hdscarf_flag = 1;//后续不考虑清理及检查计划
			}
		}//进入条件结束

		//02：--------------合同预处理（22）--------------------
		//进入条件：预定板坯号不为空 + 合同号不为空
		if (ptmmsm01["PREC_SLAB_NO"].ToString() != " " && ptmmsm01["ORDER_NO"].ToString() != " ")
		{
			v_slab_deal_type = "22";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************合同预处理[{0}]= [{1}]*****************,查询条数 = {2}", v_slab_deal_type, ptmmsm01["ORDER_NO"], tqmts9ce_q.Tables[0].Rows.get_Count());
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "22" && ptmmsm01["ORDER_NO"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString()
					&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断1：处置类别22 + 合同号与tqmts9ce["板坯处置代码相同"] + 出钢记号与tqmts9ce["出钢记号相同(不考虑板坯位置"])
					find_flag = 1;
					Log::Trace("", "", "合同代码处理1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "22" && ptmmsm01["ORDER_NO"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
					&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断2：处置类别22 + 合同号与tqmts9ce["板坯处置代码相同"] + 板坯位置与tqmts9ce["板坯位置相同，不考虑出钢记号"]
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "合同代码处理2");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "22" && ptmmsm01["ORDER_NO"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString()
					&& ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断3：处置类别22 + 合同号与tqmts9ce["板坯处置代码相同"] + 板坯类型与tqmts9ce["辅助代码相同，不考虑出钢记号和位置代码"]
					if (find_flag > 3)
					{
						find_flag = 3;
						Log::Trace("", "", "合同代码处理3");
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "22" && ptmmsm01["ORDER_NO"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString()
					&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断4：处置类别22 + 合同号与tqmts9ce["板坯处置代码相同，不考虑板坯类型、出钢记号和位置代码"]
					if (find_flag > 4)
					{
						find_flag = 4;
						Log::Trace("", "", "合同代码处理4");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				v_process_dispose = 1;//后续不考虑钢种要求
				v_slab_hdscarf_flag = 1;//后续不考虑清理及检查计划
			}
		}

		//03：--------------板坯炉次预处理(21)---------------------
		//对预留pono进行设定处置
		if (' ' != ptmmsm01["PONO"].ToString().Substring(0, 1))
		{
			v_slab_deal_type = "21";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************板坯炉次预处理[{0}] = [{1}]*****************,查询条数[{2}]", v_slab_deal_type, v_pre_slab_no, v_pre_slab_no_1, tqmts9ce_q.Tables[0].Rows.get_Count());
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "21" && v_pre_slab_no == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
				{
					//判断1 - 处置类别21 + 设定板坯号（pono + 顺序号）
					find_flag = 1;//"1"的优先级最高				
					Log::Trace("", "", "板坯炉次预处理1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "21" && v_pre_slab_no_1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
				{
					//判断2 - 处置类别21 + 设定板坯号（pono + 流号 + 00）
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "板坯炉次预处理2");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				v_process_dispose = 1;//后续不考虑钢种要求
				v_slab_hdscarf_flag = 1;//后续不考虑清理及检查计划
			}
		}


		//04：出钢记号处理，分内供、外供坯处置
		if (v_process_dispose == 0)//如果在用户代码中有要求则不再对内供、外供出钢记号进行处置
		{
			//--------------板坯去向判断---------------------
			//板坯去向为空，或者板坯去向为00、01（只对外供板坯进行处理，减少查静态表的次数）
			if (ptmmsm01["MAT_DESTION"].ToString() != "00" && ptmmsm01["MAT_DESTION"].ToString() != "01" && ' ' != ptmmsm01["MAT_DESTION"].ToString().Substring(0, 1))
			{
				v_slab_deal_type = "9";
				cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
				tqmts9ce_q.Tables[0].Rows.Clear();
				cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
				tqmts9ce_tmp.Reset();
				Log::Trace("", "", "tqmts9ce_q[{0}]", tqmts9ce_q.Tables[0].Rows.get_Count());
				Log::Trace("", "", " *************外供坯处理(0) = [{0}] *****************,查询条数", v_slab_deal_type, ptmmsm01["PREC_ST_NO"], tqmts9ce_q.Tables[0].Rows.get_Count());
				find_flag = 10;//"1"的优先级最高
				for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
				{
					tqmts9ce.Reset();
					tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
					Log::Trace("", "", "PATTERN_NO[{0}]", tqmts9ce["PATTERN_NO"]);
					if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "9"
						&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString()
						&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断1 - 处置类别9 + 出钢记号 + 板坯顺序号
						find_flag = 1;//"1"的优先级最高
						v_slab_hdscarf_flag = 1;//有特殊要求处理,不再执行清理标准及检查标准
						Log::Trace("", "", "外供坯判断1");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						break;
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "9"
						&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
						&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断2 - 处置类别9 + 外供板坯的默认处理
						if (find_flag > 2)
						{
							find_flag = 2;
							Log::Trace("", "", "外供坯判断2");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "9" && "XX" == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
						|| "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString()
						&& "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断2 - 处置类别9 + 外供板坯的默认处理
						if (find_flag > 3)
						{
							find_flag = 3;
							Log::Trace("", "", "外供坯判断3");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else continue;
				}
				if (find_flag != 10)
				{
					//数据处理
					Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
					f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				}
			}//外供坯处理(9)
			else//出钢记号判断(6)
			{
				v_slab_deal_type = "6";
				cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
				tqmts9ce_q.Tables[0].Rows.Clear();
				cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
				tqmts9ce_tmp.Reset();
				Log::Trace("", "", " *************内供出钢记号处理[{0}] =  [{1}] *****************,查询条件[{2}]", v_slab_deal_type, ptmmsm01["PREC_ST_NO"],tqmts9ce_q.Tables[0].Rows.get_Count());
				find_flag = 10;//"1"的优先级最高
				Log::Trace("", "", "slab_str1 = {0}", slab_str1);
				Log::Trace("", "", "ptmmsm01.PREC_ST_NO = {0}", ptmmsm01["PREC_ST_NO"]);
				Log::Trace("", "", "ptmmsm01.MOLD_TYPE = {0}", ptmmsm01["MOLD_TYPE"]);
				for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
				{
					tqmts9ce.Reset();
					tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
					if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString() && ptmmsm01["MOLD_TYPE"].ToString() == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断1：处置类别为6 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 板坯号控制要求与静态表.tqmts9ce["处置代码字段相同"] + 板坯结晶器类型与tqmts9ce["辅助代码相同"]
						find_flag = 1;//"1"的优先级最高
						Log::Trace("", "", "出钢记号判断1");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						break;
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断2：处置类别为6 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 板坯号控制要求与tqmts9ce["处置代码字段相同，板坯结晶器类型无要求，不考虑结晶器类型"]
						if (find_flag > 2)
						{
							find_flag = 2;
							Log::Trace("", "", "出钢记号判断2");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString() && ptmmsm01["MOLD_TYPE"].ToString() == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断3：处置类别为6 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 板坯号控制要求与tqmts9ce["处置代码字段相同"] + 板坯位置与tqmts9ce["位置字段相同"] + 板坯结晶器类型与tqmts9ce["辅助字段相同"]
						if (find_flag > 3)
						{
							find_flag = 3;
							Log::Trace("", "", "出钢记号判断3");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断4：处置类别为6 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 板坯号控制要求与tqmts9ce["处置代码字段相同"] + 板坯位置与tqmts9ce["位置字段相同，不考虑结晶器类型"]
						if (find_flag > 4)
						{
							find_flag = 4;
							Log::Trace("", "", "出钢记号判断4");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断5：处置类别为6，“板坯预订出钢记号”与tqmts9ce["出钢记号字段相同，板坯号控制要求与TQMTS9CE.处置代码字段相同，板坯位置、结晶器类型无要求"]
						if (find_flag > 5)
						{
							find_flag = 5;
							Log::Trace("", "", "出钢记号判断5");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "6" && "XX" == tqmts9ce["ST_NO"].ToString()
						&& (slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str2 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || slab_str3 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() || "X-X-XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						&& "X" == tqmts9ce["MAT_POSITION"].ToString() && ptmmsm01["MOLD_TYPE"].ToString() == tqmts9ce["ASS_DIF_CODE"].ToString())
					{
						//判断6：处置类别为6 + 板坯结晶器类型与tqmts9ce["辅助字段相同，其他不考虑"]
						if (find_flag > 6)
						{
							find_flag = 6;
							Log::Trace("", "", "出钢记号判断6");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
						}
					}
					else continue;
				}
				if (find_flag != 10)
				{
					//数据处理
					Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
					f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
					v_slab_hdscarf_flag = 1;//有特殊要求处理,不再执行清理标准及检查标准
				}
			}//出钢记号判断(6)
		}
		/*
		//05：--------------清理标准处置(3)---------------------
		//没有特殊要求的出钢记号首先按照手清要求处理，无手清要求处理的按照检查基准处理
		if(v_slab_hdscarf_flag == 0 && (0 != strcmp(tqmts0x["SLAB_HDSCARF_MODE"],"0") && (' ' != tqmts0x["SLAB_HDSCARF_MODE[0]"])))
		{
		strcpy(v_slab_deal_type,"3");
		Log::Trace("", "", " *************手清方式处理(0) = [0]*****************",v_slab_deal_type,tqmts0x["SLAB_HDSCARF_MODE"]);
		v_slab_hdscarf_flag = 0;

		EXEC SQL OPEN tqmts9ce_q;
		find_flag = 10;//"1"的优先级最高
		for( ; ;)
		{
		EXEC SQL FETCH tqmts9ce_q INTO :tqmts9ce;
		if (sqlca.sqlcode == M_NO_DATA_FOUND)
		{
		break;
		}
		if( 0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"].ToString(),"3") && 0 == strcmp(ptmmsm01["PREC_ST_NO"],tqmts9ce["ST_NO"].ToString())
		&& 0 == strcmp(tqmts0x["SLAB_HDSCARF_MODE"],tqmts9ce["SLAB_DEAL_FLAG"].ToString())
		&& (0 == strcmp(ptmmsm01["MOLD_TYPE"],tqmts9ce["ASS_DIF_CODE"].ToString())||0 == strcmp("XX",tqmts9ce["ASS_DIF_CODE"].ToString())))
		{
		//判断1 -处置类别为3 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “手清方式”与tqmts9ce["处置代码字段相同"] + 板坯结晶器类型与tqmts9ce["辅助代码字段相同"]
		find_flag = 1;//"1"的优先级最高
		EDLog(1,1,"手清方式判断1");
		break;
		}
		else if( 0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"].ToString(),"3") && 0 == strcmp("XX",tqmts9ce["ST_NO"].ToString())
		&& 0 == strcmp(tqmts0x["SLAB_HDSCARF_MODE"],tqmts9ce["SLAB_DEAL_FLAG"].ToString())
		&& (0 == strcmp(ptmmsm01["MOLD_TYPE"],tqmts9ce["ASS_DIF_CODE"].ToString())||0 == strcmp("XX",tqmts9ce["ASS_DIF_CODE"].ToString())))
		{
		//判断2 - 处置类别为3 + “手清方式”与tqmts9ce["处置代码字段相同"]  + 板坯结晶器类型与tqmts9ce["辅助代码字段相同，出钢记号不考虑"]
		if(find_flag > 2)
		{
		find_flag = 2;
		EDLog(1,1,"手清方式判断2");
		bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
		}
		}
		else continue;
		}
		EXEC SQL CLOSE tqmts9ce_q;

		if(find_flag > 1 && find_flag < 10 )
		{
		bcls_temp.GetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
		}

		if(find_flag != 10)
		{
		//数据处理
		Log::Trace("", "", "匹配标记find_flag[%d]", find_flag);
		Log::Trace("", "", "---读取静态表tqmts9ce方式号[%d]---", tqmts9ce["PATTERN_NO"]);
		f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
		v_slab_hdscarf_flag = 1;//已经安排手清就不再做检查处置
		}
		}

		//06：--------------检查基准判定（4）---------------------
		//没有特殊要求的出钢记号首先按照手清要求处理，无手清要求处理的按照检查基准处理
		if(v_slab_hdscarf_flag == 0 && (0 != strcmp(tqmts0x["SLAB_CHECK_CODE"],"0") && ' ' != tqmts0x["SLAB_CHECK_CODE[0]"]))
		{
		strcpy(v_slab_deal_type,"4");
		Log::Trace("", "", " *************板坯检查基准处理(0)*****************",v_slab_deal_type);

		EXEC SQL OPEN tqmts9ce_q;
		find_flag = 10;//"1"的优先级最高
		for( ; ;)
		{
		EXEC SQL FETCH tqmts9ce_q INTO :tqmts9ce;
		if (sqlca.sqlcode == M_NO_DATA_FOUND)
		{
		break;
		}
		if(0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"].ToString(),"4") && 0 == strcmp(ptmmsm01["PREC_ST_NO"],tqmts9ce["ST_NO"].ToString())
		&& 0 == strcmp(tqmts0x["SLAB_CHECK_CODE"],tqmts9ce["SLAB_DEAL_FLAG"].ToString())
		&& (0 == strcmp(ptmmsm01["MOLD_TYPE"],tqmts9ce["ASS_DIF_CODE"].ToString())||0 == strcmp("XX",tqmts9ce["ASS_DIF_CODE"].ToString())))
		{
		//判断1 -处置类别为4 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] +  “板坯检查基准”与tqmts9ce["处置代码字段相同"] + 板坯结晶器类型与tqmts9ce["辅助代码字段相同"]
		find_flag = 1;//"1"的优先级最高
		EDLog(1,1,"板坯检查基准判断1");
		break;
		}
		else if(0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"].ToString(),"4") && 0 == strcmp("XX",tqmts9ce["ST_NO"].ToString())
		&& 0 == strcmp(tqmts0x["SLAB_CHECK_CODE"],tqmts9ce["SLAB_DEAL_FLAG"].ToString())
		&& (0 == strcmp(ptmmsm01["MOLD_TYPE"],tqmts9ce["ASS_DIF_CODE"].ToString())||0 == strcmp("XX",tqmts9ce["ASS_DIF_CODE"].ToString())))
		{
		//判断2 -  处置类别为4 + “板坯检查基准”与tqmts9ce["处置代码字段相同"] + 板坯结晶器类型与tqmts9ce["辅助代码字段相同，出钢记号无要求"]
		if(find_flag > 2)
		{
		find_flag = 2;
		EDLog(1,1,"板坯检查基准判断2");
		bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
		}
		}
		else continue;
		}
		EXEC SQL CLOSE tqmts9ce_q;

		if(find_flag > 1 && find_flag < 10 )
		{
		bcls_temp.GetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
		}

		if(find_flag != 10)
		{
		//数据处理
		Log::Trace("", "", "匹配标记find_flag[%d]", find_flag);
		Log::Trace("", "", "---读取静态表tqmts9ce方式号[%d]---", tqmts9ce["PATTERN_NO"]);
		f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
		}
		}
		*/
		//07：--------------板坯位置判断(2)---------------------
		//注：表中用SLAB_PLACE_CODE机清标记代替二级传过来的板坯位置，表示板坯在当前炉浇铸的位置
		//“板坯位置代码”为M 或为空，用户代码中没有对板坯位置满足的板坯进行处置。（减少查静态表的次数）
		if (ptmmsm01["SLAB_PLACE_CODE"].ToString() != "M" && ' ' != ptmmsm01["SLAB_PLACE_CODE"].ToString().Substring(0, 1) && v_process_dispose != 2)
		{
			v_slab_deal_type = "2";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************板坯位置处理[{0}] = [{1}],标准 = [{2}]*****************,查询条数[{3}]", v_slab_deal_type, ptmmsm01["SLAB_PLACE_CODE"], v_slab_place_base_lg, tqmts9ce_q.Tables[0].Rows.get_Count());

			//优先取连铸标准中的位置充当基准（2位），取不到值则取制造标准中的充当基准
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "2" && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
					&& v_slab_place_base_lg == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString())
				{
					//判断1 - 处置类别为2 + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “板坯位置冲当基准”与tqmts9ce["处置代码字段相同"] + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"]
					find_flag = 1;//"1"的优先级最高
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					Log::Trace("", "", "板坯位置处理1");
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "2" && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
					&& tqmts9ce["SLAB_DEAL_FLAG"].ToString() == "XX" && tqmts9ce["ST_NO"].ToString() == ptmmsm01["PREC_ST_NO"].ToString())
				{
					//判断2 - 处置类别为2 + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同，充当基准无要求"]
					if (find_flag > 2)
					{
						find_flag = 2;
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						Log::Trace("", "", "板坯位置处理2");
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "2" && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
					&& v_slab_place_base_lg == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && tqmts9ce["ST_NO"].ToString() == "XX")
				{
					//判断3 - 处置类别为2 + “板坯位置”与tqmts9ce. 板坯位置字段相同  + “板坯位置冲当基准”与tqmts9ce["处置代码字段相同"] ，板坯预订出钢记号无要求
					if (find_flag > 3)
					{
						find_flag = 3;
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						Log::Trace("", "", "板坯位置处理3");
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "2" && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
					&& tqmts9ce["SLAB_DEAL_FLAG"].ToString() == "XX" && tqmts9ce["ST_NO"].ToString() == "XX")
				{
					//判断4 - 处置类别为2 + “板坯位置”与tqmts9ce. 板坯位置字段相同， 板坯预订出钢记号、板坯位置冲当基准无要求
					if (find_flag > 4)
					{
						find_flag = 4;
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						Log::Trace("", "", "板坯位置处理4");
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
			}
		}//板坯位置判断

		//08：--------------板坯类型判断(1)---------------------
		//“板坯类型代码”为15 或为空。（减少查静态表的次数）
		if (ptmmsm01["MAT_TYPE"].ToString() != "15" && ' ' != ptmmsm01["MAT_TYPE"].ToString().Substring(0, 1))
		{
			v_slab_deal_type = "1";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************板坯类型处理[{0}] = [{1}]*****************,查询条数[{2}]", v_slab_deal_type, ptmmsm01["MAT_TYPE"], tqmts9ce_q.Tables[0].Rows.get_Count());
			//板坯类型判断1-“板坯类型”与静态表. 处置代码字段相同，“板坯预订出钢记号”与静态表.出钢记号字段相同，“板坯位置”与静态表. 板坯位置字段相同，并且静态表.处置类别为1
			float v_temp = 0.0;
			char v_str_temp[20] = " ";
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断1 - 处置类别为1 + “板坯类型”与tqmts9ce. 处置代码字段相同 + “板坯预订出钢记号”与静态表.出钢记号字段相同 + “板坯位置”与静态表. 板坯位置字段相同
					find_flag = 1;//"1"的优先级最高
					Log::Trace("", "", "板坯类型判断1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断2 - 处置类别为1 + “板坯类型”与tqmts9ce. 处置代码字段相同 + “板坯预订出钢记号”与静态表.出钢记号字段相同 ，板坯位置无要求
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "板坯类型判断2");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString())
				{
					//判断3 - 处置类别为1 + “板坯类型”与tqmts9ce. 处置代码字段相同 + “板坯位置”与静态表. 板坯位置字段相同，出钢记号无要求
					if (find_flag > 3)
					{
						find_flag = 3;
						Log::Trace("", "", "板坯类型判断3");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString() && v_slab_place_base_lg == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断4 - 处置类别为1 + “板坯类型”与tqmts9ce["处置代码字段相同"] + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 位置充当基准与tqmts9ce["辅助代码相同，位置代码无要求"]
					if (find_flag > 4)
					{
						find_flag = 4;
						Log::Trace("", "", "板坯类型判断4");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString() && v_slab_place_base_lg == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断5 - 处置类别为1 + “板坯类型”与tqmts9ce["处置代码字段相同"] + 位置充当基准与tqmts9ce["辅助代码相同，出钢记号、位置代码无要求"]
					if (find_flag > 5)
					{
						find_flag = 5;
						Log::Trace("", "", "板坯类型判断4");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "1" && ptmmsm01["MAT_TYPE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "X" == tqmts9ce["MAT_POSITION"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断6 - 处置类别为1 + “板坯类型”与tqmts9ce["处置代码字段相同"] ，位置充当基准、出钢记号、位置代码无要求
					if (find_flag > 6)
					{
						find_flag = 6;
						Log::Trace("", "", "板坯类型判断5");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else continue;
			}
			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
			}

			//对需精整封锁注释处理
			if (ptmmsm01["FINISH_FLAG"].ToString() == "3" || ptmmsm01["FINISH_FLAG"].ToString() == "7")
			{
				if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "B")
				{
					v_temp = v_bslab_ext_pos / 1000.0;
					sprintf(v_str_temp, "B坯头预留%.1fm", v_temp);
					trim(v_str_temp);
					ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString().Trim();
					if (ptmmsm01["HOLD_REMARK"].ToString().Trim() != "" )
					{
						ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+";
					}
					ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + (CString)v_str_temp;
				}
				else if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "T")
				{
					v_temp = v_tslab_ext_pos / 1000.0;
					sprintf(v_str_temp, "T坯尾预留%.1fm", v_temp);
					trim(v_str_temp);
					if (ptmmsm01["HOLD_REMARK"].ToString() != "" && ' ' != ptmmsm01["HOLD_REMARK"].ToString().Substring(0, 1))
					{
						ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+";
					}
					ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + (CString)v_str_temp;
				}
			}
		}//板坯类型判断

		//09：--------------混浇判断(7)---------------------
		//“混浇代码”为00 或为空。（减少查静态表的次数）
		Log::Trace("", "", " 原混浇代码 = 【0】", ptmmsm01["MIX_CODE"]);
		if (ptmmsm01["MIX_CODE"].ToString() != "00")//混浇代码
		{
			v_slab_deal_type = "7";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			//判断和修改混浇位置代码，但不储存到物料主档表中
			CDecimal Lmix = fabs(ptmmsm01["MIX_START_POS"].ToDouble() - ptmmsm01["MIX_END_POS"].ToDouble()) * 1000;
			CDecimal L0 = ptmmsm01["MAT_ACT_LEN"] - Lmix;
			CString mix_code_at_2 = " ";
			Log::Trace("", "", "L0 [{0}]", Lmix);
			if (L0 < 2000)
			{
				mix_code_at_2 = "1";
			}
			else if (Lmix > 2000)
			{
				mix_code_at_2 = "2";
			}
			else if (Lmix <= 2000 && Lmix >= 200)
			{
				mix_code_at_2 = "3";
			}
			else
			{
				mix_code_at_2 = "4";
			}
			ptmmsm01["MIX_CODE"] = ptmmsm01["MIX_CODE"].ToString().Substring(0, 1) + mix_code_at_2;
			Log::Trace("", "", " 处理后混浇代码 = [{0}],查询条数[{1}]", ptmmsm01["MIX_CODE"], tqmts9ce_q.Tables[0].Rows.get_Count());
			//混浇代码处理（第一位 1:B 3:C 4:4 5:5 6:6 7:7 8:8）
			find_flag = 10;//"1"的优先级最高
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "7" && ptmmsm01["MIX_CODE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断1 - 静态表.处置类别为7 + “混浇代码”与与静态表. 处置代码字段相同 + “板坯预订出钢记号”与静态表.出钢记号字段相同
					find_flag = 1;//"1"的优先级最高
					Log::Trace("", "", "混浇代码判断1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "7" && ptmmsm01["MIX_CODE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && v_archive_flag == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断2 - 静态表.处置类别为7 + “混浇代码”与与静态表. 处置代码字段相同 + 禁止混浇标记与静态表.辅助代码字段相同
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "混浇代码判断2");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "7" && ptmmsm01["MIX_CODE"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
					&& "XX" == tqmts9ce["ST_NO"].ToString() && "XX" == tqmts9ce["ASS_DIF_CODE"].ToString())
				{
					//判断3 - 静态表.处置类别为7 + “混浇代码”与与静态表. 处置代码字段相同
					if (find_flag > 3)
					{
						find_flag = 3;
						Log::Trace("", "", "混浇代码判断3");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
					}
				}
				else continue;
			}

			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
			}

			Log::Trace("", "", "改钢标记=[0]", ptmmsm01["CHG_ST_NO_FLAG"]);
			//数据处理后如果改钢标记为20则进行混浇取样
			if (ptmmsm01["CHG_ST_NO_FLAG"].ToString() == "21")//201500831将20改成21
			{
				Log::Trace("", "", "混浇取样");
				if (ptmmsm01["STRAND_NO"].ToString() == "1" || ptmmsm01["STRAND_NO"].ToString() == "3")
				{
					st = "1";
				}
				else if (ptmmsm01["STRAND_NO"].ToString() == "2" || ptmmsm01["STRAND_NO"].ToString() == "4")
				{
					st = "2";
				}

				if (atoi(n1) > 2)
				{
					n2 = "2";
				}
				else if (atoi(n1) <= 2)
				{
					n2 = "1";
				}

				if (ptmmsm01["MIX_CODE"].ToString() == "C1" || ptmmsm01["MIX_CODE"].ToString() == "C2" || ptmmsm01["MIX_CODE"].ToString() == "C3")
				{
					Log::Trace("", "", "换包混浇板坯取样位置识别");
					//对换包混浇重新设计流程，只对位置不充当的板坯进行取样
					if (n2 == "1" || ptmmsm01["SLAB_PLACE_CODE"].ToString() == "B")
					{
						a3 = "B";
					}
					else
					{
						a3 = "T";
					}
					a3 = a3.Trim();
					Log::Trace("", "", "a3 = [{0}]", a3);
				}
				else
				{
					Log::Trace("", "", "同中包混浇板坯取样位置识别");
					//if((0 == ptqmts22->abn_st_len_4 && ptqmts22->abn_st_len_4<=1500)||(0<ptqmts22->abnr_end_place_4 && ptqmts22->abnr_end_place_4<=1500))
					if (0 == ptmmsm01["MIX_START_POS"].ToDecimal() && (0 < ptmmsm01["MIX_END_POS"].ToDecimal() && ptmmsm01["MIX_END_POS"].ToDecimal()*1000 <= 2500))
					{
						a1 = "B";
					}

					//if((0<(ptmmsm01["MAT_ACT_LEN"] - ptqmts22->abn_st_len_4) && (ptmmsm01["MAT_ACT_LEN"] - ptqmts22->abn_st_len_4)<=1500)||(0<(ptmmsm01["MAT_ACT_LEN"] - ptqmts22->abnr_end_place_4) && (ptmmsm01["MAT_ACT_LEN"] - ptqmts22->abnr_end_place_4)<=1500))
					if (0 < ptmmsm01["MIX_START_POS"].ToDecimal() && (ptmmsm01["MAT_ACT_LEN"].ToDecimal() - ptmmsm01["MIX_END_POS"].ToDecimal() * 1000) <= 2000)
					{
						a2 = "T";
					}
					a3 = a1;
					a3 = a3 + a2;
					a3 = a3.Trim();
					Log::Trace("", "", "a1= [{0}], a2= [{1}], a3 = [{2}]", a1, a2, a3);
				}

				v_slab_deal_type = "15";
				cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
				tqmts9ce_q.Tables[0].Rows.Clear();
				cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
				Log::Trace("", "", " *************混浇取样处理[{0}]*****************,查询条数[{1}]", v_slab_deal_type, tqmts9ce_q.Tables[0].Rows.get_Count());
				Log::Trace("", "", "a3= [{0}], st= [{1}], n2 = [{2}]", a3, st, n2);
				for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
				{
					tqmts9ce.Reset();
					tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
					if (tqmts9ce["SLAB_DEAL_FLAG"].ToString() == a3 && tqmts9ce["ASS_DIF_CODE"].ToString() == st
						&& tqmts9ce["MAT_POSITION"].ToString() == n2 && tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "15")
					{
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
						f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
						break;
					}
					else continue;
				}
			}//混浇取样结束
		}//混浇判断

		//10：---------性能代码判断即切割硫印样判断(14)----------
		if (tqmts0x["SLAB_SAMPLING_CODE_SUL"].ToString() == " " || tqmts0x["SLAB_SAMPLING_CODE_SUL"].ToString() == "0" || tqmts9ce["CHG_ST_NO_FLAG"].ToString() != " ")
		{
			Log::Trace("", "", "切割硫印样为空或者为0，不做取样要求");
		}
		else
		{
			v_slab_deal_type = "14";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************性能处理[{0}]*****************,查询条数[{1}]", v_slab_deal_type, tqmts9ce_q.Tables[0].Rows.get_Count());
			for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
			{
				tqmts9ce.Reset();
				tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
				if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "14" && tqmts0x["SLAB_SAMPLING_CODE_SUL"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString())
				{
					//判断1 - 处置类别为14 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + 板坯对应出钢记号的性能代码与tqmts9ce["处置代码相同"]
					find_flag = 1;//"1"的优先级最高
					Log::Trace("", "", "性能代码判断1");
					tqmts9ce_tmp.CopyFrom(tqmts9ce);
					break;
				}
				else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "14" && tqmts0x["SLAB_SAMPLING_CODE_SUL"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && tqmts9ce["ST_NO"].ToString() == "XX")
				{
					//判断2 - 处置类别为14 + 板坯对应出钢记号的性能代码与tqmts9ce["处置代码相同，出钢记号不考虑"]
					if (find_flag > 2)
					{
						find_flag = 2;
						Log::Trace("", "", "性能代码判断2");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
					}
				}
				else continue;
			}

			if (find_flag != 10)
			{
				//数据处理
				Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
				f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				v_slab_hdscarf_flag = 1;//已经安排手清就不再做检查处置
			}
		}

		//11：--------------异常代码判断(10) + 质量模型结果处理(12)---------------------	
		//if (ptmmsm01["MODEL_JUDGE"].ToString() != "0" && (ptmmsm01["HOT_SEND_FLAG"].ToString() != "3" && ptmmsm01["HOT_SEND_FLAG"].ToString() != "2"))//应该用标准中的数据？？
		if (ptmmsm01["MODEL_JUDGE"].ToString() != "0")//模型判定结果
		{
			int find_flag_temp = 0;
			CString l_code = " ";
			CString l_model_judge = " ";
			CDecimal l_start = 0;
			CDecimal l_end = 0;
			char tmp[4 + 1] = "";
			CString code3 = " ";

			v_slab_deal_type = "10";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************异常代码处理[{0}]  = [{1}, {2}, {3}, {4}]*****************", v_slab_deal_type, ptmmsm01["MODEL_EVT_1"], ptmmsm01["MODEL_EVT_2"], ptmmsm01["MODEL_EVT_3"], ptmmsm01["MODEL_EVT_4"]);
			//循环三次，取异常代码值
			for (int i = 1; i < 5; i++)
			{
				//对异常代码进行判断，如果异常代码为0，则直接跳出结束
				Log::Trace("", "", "异常代码%d判断！", i);
				switch (i)
				{
				case 1:
					l_code = ptmmsm01["MODEL_EVT_1"];
					l_start = ptmmsm01["MODEL_START_1"];
					l_end = ptmmsm01["MODEL_END_1"];
					l_model_judge = ptmmsm01["MODEL_JUDGE_1"];
					//Log::Trace("", "", "异常代码一");
					break;
				case 2:
					l_code = ptmmsm01["MODEL_EVT_2"];
					l_start = ptmmsm01["MODEL_START_2"];
					l_end = ptmmsm01["MODEL_END_2"];
					l_model_judge = ptmmsm01["MODEL_JUDGE_2"];
					//Log::Trace("", "", "异常代码一");
					break;
				case 3:
					l_code = ptmmsm01["MODEL_EVT_3"];
					l_start = ptmmsm01["MODEL_START_3"];
					l_end = ptmmsm01["MODEL_END_3"];
					l_model_judge = ptmmsm01["MODEL_JUDGE_3"];
					//Log::Trace("", "", "异常代码三");
					break;
				case 4:
					l_code = ptmmsm01["MODEL_EVT_4"];
					l_start = ptmmsm01["MODEL_START_4"];
					l_end = ptmmsm01["MODEL_END_4"];
					l_model_judge = ptmmsm01["MODEL_JUDGE_4"];
					//Log::Trace("", "", "异常代码三");
					break;
				}
				Log::Trace("", "", "l_code ={0}", l_code);
				if (l_code == "0" || l_code == " " || l_code == "00")
				{
					Log::Trace("", "", "没有需要处理的异常代码！");
				}
				else
				{
					find_flag = 10;//"1"的优先级最高
					for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
					{
						tqmts9ce.Reset();
						tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
						//if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10" && l_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString())
						if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10"
							&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
							&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
							&& l_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
							&& l_model_judge == tqmts9ce["ASS_DIF_CODE"].ToString())
						{
							//判断1 - 处置类别为10 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “异常代码”与tqmts9ce["处置代码字段相同"] + “模型结果”与tqmts9ce["辅助代码字段相同"]
							find_flag = 1;//"1"的优先级最高
							Log::Trace("", "", "异常代码判断1");
							tqmts9ce_tmp.CopyFrom(tqmts9ce); 
							break;
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10"
							&& "XX" == tqmts9ce["ST_NO"].ToString()
							&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
							&& l_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
							&& l_model_judge == tqmts9ce["ASS_DIF_CODE"].ToString())
						{
							//判断2 - 处置类别为10 + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “异常代码”与tqmts9ce["处置代码字段相同"] + “模型结果”与tqmts9ce["辅助代码字段相同"]
							if (find_flag > 2)
							{
								find_flag = 2;
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								Log::Trace("", "", "异常代码判断2");
							}
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10"
							&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
							&& "X" == tqmts9ce["MAT_POSITION"].ToString()
							&& l_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
							&& l_model_judge == tqmts9ce["ASS_DIF_CODE"].ToString())
						{
							//判断3 - 处置类别为10 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “异常代码”与tqmts9ce["处置代码字段相同"] + “模型结果”与tqmts9ce["辅助代码字段相同"]
							if (find_flag > 3)
							{
								find_flag = 3;
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								Log::Trace("", "", "异常代码判断3");
							}
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10"
							&& "XX" == tqmts9ce["ST_NO"].ToString()
							&& "X" == tqmts9ce["MAT_POSITION"].ToString()
							&& l_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
							&& l_model_judge == tqmts9ce["ASS_DIF_CODE"].ToString())
						{
							//判断4 - 处置类别为10 + “异常代码”与tqmts9ce["处置代码字段相同"] + “模型结果”与tqmts9ce["辅助代码字段相同"]
							if (find_flag > 4)
							{
								find_flag = 4;
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								Log::Trace("", "", "异常代码判断4");
							}
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "10"
							&& "XX" == tqmts9ce["ST_NO"].ToString()
							&& "X" == tqmts9ce["MAT_POSITION"].ToString()
							&& "XX" == tqmts9ce["SLAB_DEAL_FLAG"].ToString()
							&& l_model_judge == tqmts9ce["ASS_DIF_CODE"].ToString())
						{
							//判断4 - 处置类别为10 + “模型结果”与tqmts9ce["辅助代码字段相同"]
							if (find_flag > 5)
							{
								find_flag = 5;
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								Log::Trace("", "", "异常代码判断5");
							}
						}
						else continue;
					}

					if (find_flag != 10)
					{
						//数据处理
						Log::Trace("", "", "找到满足异常代码判断的条件，对位置进行处理！");
						//通过板坯长度判断板坯处理位置deal_place值
						if ("3" == tqmts9ce_tmp["CLEACN_WAY_CODE"].ToString() || "3" == tqmts9ce_tmp["CLEACN_WAY_CODE"].ToString())
						{
							if (l_start * 1000 < 3000)
							{
								strcpy(tmp, "1000");
								if (tqmts9ce_tmp["DEAL_PLACE"].ToString().Trim() == "")
								{
									tqmts9ce_tmp["DEAL_PLACE"] = tmp;
								}
								else
								{
									char ce_tmp[5] = "";
									strcpy(ce_tmp, tqmts9ce_tmp["DEAL_PLACE"].ToString());
									Log::Trace("", "", "ce_tmp = {0}", ce_tmp);
									for (int i = 0; i < 4; i++)
									{
										ce_tmp[i] = ce_tmp[i] == '1' ? '1' : (tmp[i] == '1' ? '1' : '0');
									}
									tqmts9ce_tmp["DEAL_PLACE"] = CString(ce_tmp);
									Log::Trace("", "", "tqmts9ce_tmp[DEAL_PLACE] = {0}", tqmts9ce_tmp["DEAL_PLACE"].ToString());
								}
							}
							else if ((ptmmsm01["MAT_ACT_LEN"].ToDecimal() - l_start * 1000) < 3000)
							{
								strcpy(tmp, "1000");
								if (tqmts9ce_tmp["DEAL_PLACE"].ToString().Trim() == "")
								{
									tqmts9ce_tmp["DEAL_PLACE"] = tmp;
								}
								else
								{
									char ce_tmp[5] = "";
									strcpy(ce_tmp, tqmts9ce_tmp["DEAL_PLACE"].ToString());
									Log::Trace("", "", "ce_tmp = {0}", ce_tmp);
									for (int i = 0; i < 4; i++)
									{
										ce_tmp[i] = ce_tmp[i] == '1' ? '1' : (tmp[i] == '1' ? '1' : '0');
									}
									tqmts9ce_tmp["DEAL_PLACE"] = CString(ce_tmp);
									Log::Trace("", "", "tqmts9ce_tmp[DEAL_PLACE] = {0}", tqmts9ce_tmp["DEAL_PLACE"].ToString());
								}
							}
							else if (abs(l_end.ToDouble() - l_start.ToDouble()) > 3)
							{
								strcpy(tmp, "1000");
								if (tqmts9ce_tmp["DEAL_PLACE"].ToString().Trim() == "")
								{
									tqmts9ce_tmp["DEAL_PLACE"] = tmp;
								}
								else
								{
									char ce_tmp[5] = "";
									strcpy(ce_tmp, tqmts9ce_tmp["DEAL_PLACE"].ToString());
									Log::Trace("", "", "ce_tmp = {0}", ce_tmp);
									for (int i = 0; i < 4; i++)
									{
										ce_tmp[i] = ce_tmp[i] == '1' ? '1' : (tmp[i] == '1' ? '1' : '0');
									}
									tqmts9ce_tmp["DEAL_PLACE"] = CString(ce_tmp);
									Log::Trace("", "", "tqmts9ce_tmp[DEAL_PLACE] = {0}", tqmts9ce_tmp["DEAL_PLACE"].ToString());
								}
							}
						}
						else
						{
							strcpy(tmp, "1000");
							if (tqmts9ce_tmp["DEAL_PLACE"].ToString().Trim() == "")
							{
								tqmts9ce_tmp["DEAL_PLACE"] = tmp;
							}
							else
							{
								char ce_tmp[5] = "";
								strcpy(ce_tmp, tqmts9ce_tmp["DEAL_PLACE"].ToString());
								Log::Trace("", "", "ce_tmp = {0}", ce_tmp);
								for (int i = 0; i < 4; i++)
								{
									ce_tmp[i] = ce_tmp[i] == '1' ? '1' : (tmp[i] == '1' ? '1' : '0');
								}
								tqmts9ce_tmp["DEAL_PLACE"] = CString(ce_tmp);
								Log::Trace("", "", "tqmts9ce_tmp[DEAL_PLACE] = {0}", tqmts9ce_tmp["DEAL_PLACE"].ToString());
							}
						}
						//数据处理
						Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
						f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
						find_flag_temp = 1;
					}
				}
			}

			if (0 == find_flag_temp) //模型处理方式
			{
				v_slab_deal_type = "12";
				cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
				tqmts9ce_q.Tables[0].Rows.Clear();
				cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
				tqmts9ce_tmp.Reset();
				Log::Trace("", "", "*************质量模型结果处理[{0}] = {[1]}*****************", v_slab_deal_type, ptmmsm01["MODEL_TREAT"].ToString());
				//Log::Trace("", "", "surface_grade_code[0],inner_grade_code[0]", ptmmsm01["MODEL_TREAT"], ptmmsm01["INNER_GRADE_CODE"]);

				if (ptmmsm01["MODEL_TREAT"].ToString() != "0")
				{
					find_flag = 10;//"1"的优先级最高
					for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
					{
						tqmts9ce.Reset();
						tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
						//if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "12" && ptmmsm01["MODEL_TREAT"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString())
						if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "12"
							&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
							&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
							&& ptmmsm01["MODEL_TREAT"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						{
							//判断1 - 处置类别为12 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “质量模型结果”与tqmts9ce["处置代码字段相同"]
							find_flag = 1;//"1"的优先级最高
							Log::Trace("", "", "质量模型结果判断1");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
							break;
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "12"
							&& "XX" == tqmts9ce["ST_NO"].ToString()
							&& ptmmsm01["SLAB_PLACE_CODE"].ToString() == tqmts9ce["MAT_POSITION"].ToString()
							&& ptmmsm01["MODEL_TREAT"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						{
							//判断2 - 处置类别为12 + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “质量模型结果”与tqmts9ce["处置代码字段相同"]
							if (find_flag > 2)
							{
								find_flag = 2;
								Log::Trace("", "", "板坯类型判断2");
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
							}
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "12"
							&& ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString()
							&& "X" == tqmts9ce["MAT_POSITION"].ToString()
							&& ptmmsm01["MODEL_TREAT"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						{
							//判断3 - 处置类别为12 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “质量模型结果”与tqmts9ce["处置代码字段相同"]
							if (find_flag > 3)
							{
								find_flag = 3;
								Log::Trace("", "", "板坯类型判断2");
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
							}
						}
						else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "12"
							&& "XX" == tqmts9ce["ST_NO"].ToString()
							&& "X" == tqmts9ce["MAT_POSITION"].ToString()
							&& ptmmsm01["MODEL_TREAT"].ToString() == tqmts9ce["SLAB_DEAL_FLAG"].ToString())
						{
							//判断4 - 处置类别为12 + “板坯预订出钢记号”与tqmts9ce["出钢记号字段相同"] + “板坯位置”与tqmts9ce. 板坯位置字段相同 + “质量模型结果”与tqmts9ce["处置代码字段相同"]
							if (find_flag > 4)
							{
								find_flag = 4;
								Log::Trace("", "", "板坯类型判断2");
								tqmts9ce_tmp.CopyFrom(tqmts9ce);
								//bcls_temp.SetColVal(1, 1, (T_INFO *)&tqmts9ce_info);
							}
						}
						else continue;
					}
					if (find_flag != 10)
					{
						//数据处理
						Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
						f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
					}
				}
			}
		}



		Log::Trace("", "", "CHG_ST_NO_FLAG = {0}", ptmmsm01["CHG_ST_NO_FLAG"].ToString());
		//12：wei.cx2016-5-30 改钢判定(20)-----------------------
		if (ptmmsm01["CHG_ST_NO_FLAG"].ToString().Trim() != "")//从配置表TQMTS9CE中查出
		{

			ret = f_qmbs_chag_stno(ptmmsm01, tqmts0x, bcls_ret, conn);

			if (0 != ret)
			{
				Log::Trace("", "", "调用改钢判定出错");
			}

		}

		//13：--------------规格判断(11)---------------------
		//调用规格判断函数
		ret = f_qmbs_dest(ptmmsm01, bcls_ret, conn);
		if (0 != ret)
		{
			Log::Trace("", "", "调用调用规格判断函数出错");
			sprintf(s.msg, "调用调用规格判断函数出错");
			throw CApplicationException(-1, s.msg, log.Location);
		}

		//14：--------------取复检样判断(17)---------------------(强制热送板坯不下线取样)
		if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "M" && (ptmmsm01["DECI_ST_NO"].ToString() == "YY000000" || ptmmsm01["DECI_ST_NO"].ToString() == " ") && (ptmmsm01["HOT_SEND_FLAG"].ToString() != "2" && ptmmsm01["HOT_SEND_FLAG"].ToString() != "3"))
		{
			v_slab_deal_type = "17";
			cmd_9ce.Parameters.Set("v_slab_deal_type", v_slab_deal_type);
			tqmts9ce_q.Tables[0].Rows.Clear();
			cmd_9ce.ExecuteQuery(tqmts9ce_q.Tables[0]);
			tqmts9ce_tmp.Reset();
			Log::Trace("", "", " *************取复检样处理[{0}]*****************,查询条数[{1}]", v_slab_deal_type, tqmts9ce_q.Tables[0].Rows.get_Count());

			sqlstr = " SELECT YY_CAUSE"
				"				   FROM TQMTS23"
				"				   WHERE HEAT_NO = @heat_no";
			cmd.SetCommandText(sqlstr);
			cmd.Parameters.Set("heat_no", ptmmsm01["HEAT_NO"]);
			cmd.ExecuteReader();
			if (cmd.Read())
			{
				v_yy_cause = cmd.GetString(1);
			}
			else
			{
				v_yy_cause = "1";
			}
			cmd.Close();
			if (v_yy_cause == "1" || v_yy_cause == "2" || (v_yy_cause == "71" || v_yy_cause == "72" || v_yy_cause == "78") || v_yy_cause == " ")//只对无成份或者成份超标的YY炉次取样
			{
				find_flag = 10;//"1"的优先级最高
				for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
				{
					tqmts9ce.Reset();
					tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
					if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "17" && slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && ptmmsm01["PREC_ST_NO"].ToString() == tqmts9ce["ST_NO"].ToString())
					{
						//判断1 - 处置类别17，板坯号满足n3_1，出钢机号满足要求
						find_flag = 1;//"1"的优先级最高
						Log::Trace("", "", "取复检样判断1");
						tqmts9ce_tmp.CopyFrom(tqmts9ce);
						break;
					}
					else if (tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "17" && slab_str1 == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && "XX" == tqmts9ce["ST_NO"].ToString())
					{
						//判断2 - 处置类别17，板坯号满足n3_1，出钢机号没有要求
						if (find_flag > 2)
						{
							find_flag = 2;
							Log::Trace("", "", "取复检样判断2");
							tqmts9ce_tmp.CopyFrom(tqmts9ce);
						}
					}
					else continue;
				}
				if (find_flag != 10)
				{
					//数据处理
					Log::Trace("", "", "v_slab_deal_type[{0}]find_flag[{1}]PATTERN_NO[{2}]", v_slab_deal_type, find_flag, tqmts9ce_tmp["PATTERN_NO"]);
					f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
				}
			}
		}

		//------对满足花纹板规格要求的改钢板坯将出钢记号修改为GR3180F2、GR4180F2-------------
		/*if (ptmmsm01["SURFACE_DECIDE_CODE"].ToString() == "1" && ptmmsm01["PREC_SLAB_NO"].ToString() == " ")
		{
		if ((ptmmsm01["FIN_ST_NO"].ToString() == "GR3160F1" || ptmmsm01["FIN_ST_NO"].ToString() == "GR3160F4"
		|| ptmmsm01["FIN_ST_NO"].ToString() == "GR4160F4" || ptmmsm01["FIN_ST_NO"].ToString() == "GR4160F1"
		|| ptmmsm01["FIN_ST_NO"].ToString() == "AP1860C1") && tqmts9ce["CHG_ST_NO_TYPE"].ToString() != "4")
		{
		if ((ptmmsm01["MAT_ACT_LEN"].ToDecimal() >= 7000 && ptmmsm01["MAT_ACT_LEN"].ToDecimal() <= 8500)
		&& ((ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() >= 1010 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() <= 1100) || (ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() >= 1240 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() <= 1300)))
		{
		if (ptmmsm01["FIN_ST_NO"].ToString() == "GR3160F1" || ptmmsm01["FIN_ST_NO"].ToString() == "GR3160F4" || ptmmsm01["FIN_ST_NO"].ToString() == "AP1860C1")
		{
		ptmmsm01["FIN_ST_NO"] = "GR3180F2";
		}
		else if (ptmmsm01["FIN_ST_NO"].ToString() == "GR4160F1" || ptmmsm01["FIN_ST_NO"].ToString() == "GR4160F4")
		{
		ptmmsm01["FIN_ST_NO"] = "GR4180F2";
		}
		ptmmsm01["ST_NO"] = ptmmsm01["FIN_ST_NO"];
		ptmmsm01["MAT_DESTION"] = "00";
		}
		}
		else if (ptmmsm01["ST_NO"].ToString() == "GR3180F2" || ptmmsm01["ST_NO"].ToString() == "GR4180F2")
		{
		if (ptmmsm01["MAT_ACT_LEN"].ToDecimal() < 7000 || ptmmsm01["MAT_ACT_LEN"].ToDecimal() > 8500 || ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() < 1010
		|| ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() > 1300 || (ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() < 1240 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() > 1100))
		{
		if (ptmmsm01["ST_NO"].ToString() == "GR3180F2")
		{
		ptmmsm01["FIN_ST_NO"] = "GR3160F1";
		}
		else if (ptmmsm01["ST_NO"].ToString() == "GR4180F2")
		{
		ptmmsm01["FIN_ST_NO"] = "GR4160F1";
		}
		ptmmsm01["ST_NO"] = ptmmsm01["FIN_ST_NO"];
		ptmmsm01["MAT_DESTION"] = "01";
		if (ptmmsm01["CHG_ST_NO_TYPE"].ToString() == " ")
		ptmmsm01["CHG_ST_NO_TYPE"] = "9";
		}
		}
		}*/

		//对改钢但无最终出钢记号的板坯需要封锁
		if (ptmmsm01["CHG_ST_NO_TYPE"].ToString() != " " && 8 != strlen(ptmmsm01["FIN_ST_NO"]))
		{
			ptmmsm01["SURFACE_DECIDE_CODE"] = "4";//有改钢原因就必须有最终出钢记号
		}

		Log::Trace("", "", "--X1-处理标记----[{0}]", ptmmsm01["FINISH_FLAG"].ToString());
		Log::Trace("", "", "--X2-计划精整方法----[{0}]", ptmmsm01["FINISH_MODE"].ToString());
		Log::Trace("", "", "--X3-计划清理标记----[{0}]", ptmmsm01["PLAN_CLEAN_FLAG"].ToString());
		Log::Trace("", "", "--X4-计划清理方法----[{0}]", ptmmsm01["HDSCARF_MODE"].ToString());
		Log::Trace("", "", "--X5-改钢标记----[{0}]", ptmmsm01["CHG_ST_NO_FLAG"].ToString());
		Log::Trace("", "", "--X6-封锁原因----[{0}]", ptmmsm01["HOLD_CAUSE_CODE"].ToString());
		Log::Trace("", "", "--X7-封锁注释----[{0}]", ptmmsm01["HOLD_REMARK"].ToString());
		Log::Trace("", "", "--X8-缺陷代码----[{0}]", ptmmsm01["DEFECT_CODE_F_1"].ToString());
		Log::Trace("", "", "--X8-缺陷代码----[{0}]", ptmmsm01["DEFECT_CODE_F_2"].ToString());
		Log::Trace("", "", "--X8-缺陷代码----[{0}]", ptmmsm01["DEFECT_CODE_F_3"].ToString());
		Log::Trace("", "", "--X8-缺陷代码----[{0}]", ptmmsm01["DEFECT_CODE_F_4"].ToString());
		Log::Trace("", "", "--X9-表面判定----[{0}]", ptmmsm01["SURFACE_DECIDE_CODE"].ToString());
		Log::Trace("", "", "--X10-处理位置---[{0}]", ptmmsm01["CLEAN_POS"].ToString());
		Log::Trace("", "", "--X11-跺位推荐---[{0}]", ptmmsm01["STOCK_PLACE_NO_TO"].ToString());
		Log::Trace("", "", "--X12-性能判定---[{0}]", ptmmsm01["PCH_JUDGE_CODE"].ToString());
		Log::Trace("", "", "--X13-取样指示---[{0}]", ptmmsm01["SLAB_SAMPLE_REQ"].ToString());
		Log::Trace("", "", "--X14-出钢记号---[{0}]", ptmmsm01["FIN_ST_NO"].ToString());
		Log::Trace("", "", "--X15-改钢原因---[{0}]", ptmmsm01["CHG_ST_NO_TYPE"].ToString());
		Log::Trace("", "", "--X16-改钢等级---[{0}]", ptmmsm01["CHG_ST_NO_GRADE"].ToString());
		Log::Trace("", "", "--X17-下线原因---[{0}]", ptmmsm01["SLAT_UNLADE_CAUSE"].ToString());
		Log::Trace("", "", "--X18-板坯去向---[{0}]", ptmmsm01["MAT_DESTION"].ToString());

		if (ptmmsm01["CLEAN_POS"].ToString() == "0000")
			ptmmsm01["CLEAN_POS"] = " ";

		//表面判断代码相应处理
		ptmmsm01["HOLD_FLAG"] = "0"; //正常为释放
		if (ptmmsm01["SURFACE_DECIDE_CODE"].ToString() == "4")
		{
			ptmmsm01["HOLD_FLAG"] = "1";
		}
		//gettime(ch_time);
		ptmmsm01["SURFACE_DECIDE_MAKER"] = "SYSTEM";
		ptmmsm01["SURFACE_DECIDE_TIME"] = datetime;
		//调用物料跟踪函数
		EIClass bcls_mmsm99;
		blkNum = bcls_mmsm99.Tables.IndexOf("MM0099");
		if (blkNum < 0)
		{
			bcls_mmsm99.Tables.Add("MM0099");
		}
		ptmmsm01.MergeTo(bcls_mmsm99.Tables["MM0099"], false);
		bcls_mmsm99.Tables["MM0099"].Columns.Add(DT_STRING, "EVENT_ID");
		bcls_mmsm99.Tables["MM0099"].Columns.Add(DT_STRING, "SYSTEM_ID");
		bcls_mmsm99.Tables["MM0099"].Columns.Add(DT_STRING, "EVENT_LINE_TYPE");
		bcls_mmsm99.Tables["MM0099"].Columns.Add(DT_STRING, "FUNC_ID");
		bcls_mmsm99.Tables["MM0099"].Rows[0]["EVENT_ID"] = "QM99";
		bcls_mmsm99.Tables["MM0099"].Rows[0]["SYSTEM_ID"] = "QMBS";
		bcls_mmsm99.Tables["MM0099"].Rows[0]["EVENT_LINE_TYPE"] = "00";
		bcls_mmsm99.Tables["MM0099"].Rows[0]["FUNC_ID"] = s.svc_name;
		doFlag = f_mmsm99(&bcls_mmsm99, bcls_ret, conn);
		if (doFlag < 0)
		{
			throw CApplicationException(-1, s.msg, s.svc_name);
		}
	}
	catch (CDbException& ex)
	{
		CFormattable arguments[] = { ex.GetCode(), ex.GetMsg() };
		CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
		CString str = sqlstr + "\r\n" + ex.GetMsg();
		strncpy(s.sysmsg, (const char*)str, sizeof(s.sysmsg) - 1);
		s.flag = -1;
		doFlag = -1;
	}
	catch (CApplicationException& ex)
	{
		s.flag = ex.GetCode();
		doFlag = -1;
	}
	catch (CException& ex)
	{
		strcpy(s.msg, ex.GetMsg());
		s.flag = ex.GetCode();
		doFlag = -1;
	}

	cmd_9ce.Close();
	return doFlag;
}


