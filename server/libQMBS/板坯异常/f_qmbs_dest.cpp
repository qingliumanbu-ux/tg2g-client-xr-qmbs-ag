/*************************************************
 *	Copyright (c) Baosight Corporation 2011 . All Rights Reserved.
 *  	MG2SM 梅钢二炼钢L3系统
 *****************************************************************************
 *  程序名称			: f_mmsm01_dest
 *  程序描述			: 板坯规格判定
 *  备注说明			:
 *  创建日期         : 2014-04-8
 *  修改历史			: 2017-10-13（完善宽度判定及信息维护）
 *                   : 2023-05-28 panchen: 代码转最新框架
 *
 *			... ...
 * **************************************************************************** */

#include "stdafx.h"
#include <math.h>

BM2_FUNCTION_EXPORT

int f_qmbs_data_proc(CModel &ptmmsm01, CModel &ptqmts9ce, EIClass *bcls_ret);
int f_qmbs_slab_width_round(float width_value);
int f_qmbs_dest(CModel &ptmmsm01, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  try
  {
    int sqlid = 0;
    int find_flag = 0;
    CString v_width_chge_flag = " ";
    int hsf_flag = 0; // 是否精整标记

    /* ***** 宿主变量定义 ***** */
    CString v_hardness_group = " ";
    CString c_st_no = " ";
    CString v_pre_slab_no = "";         // 预定板坯号
    CString v_st_no = " ";              // 出钢记号
    double v_slab_width_max = 0.0;      // 板坯允许最大宽度值
    double v_slab_width_min = 0.0;      // 板坯允许最小宽度值
    double v_slab_width_max_plan = 0.0; // 板坯计划允许最大宽度值
    double v_slab_width_min_plan = 0.0; // 板坯计划允许最小宽度值
    CString v_steel_group = " ";
    CString v_slab_dhcr_code = " ";
    CDbCommand cmd(conn);
    CString sqlstr = " ";
    CModel tqmts9cc("TQMTS9CC");
    CModel tqmts9ce("TQMTS9CE");
    char hold_cause_remark[80];

    // 全局变量初始化

    // 查询静态表TQMTS9CE
    sqlstr = " SELECT  *"
             "			FROM  TQMTS9CE"
             "			WHERE slab_deal_type = '16'"
             "			ORDER  BY  slab_deal_flag, ass_dif_code, rec_create_time DESC ";
    EIClass tqmts9ce_q;
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(tqmts9ce_q.Tables[0]);
    cmd.Close();
    v_slab_width_max_plan = ptmmsm01["SLAB_WIDTH_MAX_NOM"];
    v_slab_width_min_plan = ptmmsm01["SLAB_WIDTH_MIN_NOM"];

    if (ptmmsm01["PREC_SLAB_NO"].ToString().GetLength() == 9)
    {
      if (ptmmsm01["SLAB_HEAD_WIDTH"].ToDecimal() < ptmmsm01["SLAB_WIDTH_MIN_NOM"].ToDecimal() - 5 || ptmmsm01["SLAB_TAIL_WIDTH"].ToDecimal() < ptmmsm01["SLAB_WIDTH_MIN_NOM"].ToDecimal() - 5)
      {
        Log::Trace("", "", "板坯宽度低于计划宽度！！");
        ptmmsm01["PREC_SLAB_NO"] = " "; // 预定板坯号置空
        ptmmsm01["NO_CAUSE"] = "4";     // 未赋号理由
        ptmmsm01["ORDER_NO"] = " ";     // 合同号
        ptmmsm01["PONO_SLAB"] = " ";    // 预定板坯号
        ptmmsm01["PONO_SLAB_1"] = " ";  // 预定板坯号1
        v_slab_width_max_plan = 0.0;
        v_slab_width_min_plan = 0.0;
      }
    }
    // 对强制热轧钢种计划宽度进行处理
    if ((0 == strcmp(v_slab_dhcr_code, "0") || 0 == strcmp(v_slab_dhcr_code, "2")))
    {
      v_slab_width_max_plan = 0.0;
      v_slab_width_min_plan = 0.0;
    }

    /*****************程序处理******************/
    // 板坯去向处理，01、00以外的全部归为10
    if (0 == strcmp(ptmmsm01["PREC_SLAB_NO"], " ") && (0 == strcmp(ptmmsm01["MAT_DESTION"], "00") || 0 == strcmp(ptmmsm01["MAT_DESTION"], "01"))) // 去向是00、01的无预定板坯号板坯去向维护
    {
      if (0 != strcmp(ptmmsm01["FINISH_MODE"], "2")) // 无横切要求
      {
        if (9560 < ptmmsm01["MAT_ACT_LEN"].ToDecimal() && 900 < ptmmsm01["SLAB_HEAD_WIDTH"].ToDecimal() && 0 == strcmp(ptmmsm01["MAT_DESTION"], "00")) // 板坯长度大于9600，并且去向是00，板坯去向更改为01
        {
          ptmmsm01["MAT_DESTION"] = "01";
        }
        else if ((8000 > ptmmsm01["MAT_ACT_LEN"].ToDecimal() && 7000 <= ptmmsm01["MAT_ACT_LEN"].ToDecimal()) && 0 == strcmp(ptmmsm01["MAT_DESTION"], "01")) // 板坯长度7000——8000，并且去向是01，板坯去向更改为00
        {
          ptmmsm01["MAT_DESTION"] = "00";
        }
        else if ((5300 > ptmmsm01["MAT_ACT_LEN"].ToDecimal() && 4600 < ptmmsm01["MAT_ACT_LEN"].ToDecimal() && 900 < ptmmsm01["SLAB_HEAD_WIDTH"].ToDecimal()) && 0 == strcmp(ptmmsm01["MAT_DESTION"], "00")) // 板坯长度4500——7000，并且去向是01，板坯去向更改为00
        {
          ptmmsm01["MAT_DESTION"] = "01";
        }
        else if ((4500 > ptmmsm01["MAT_ACT_LEN"].ToDecimal() && 4200 <= ptmmsm01["MAT_ACT_LEN"].ToDecimal()) && 0 == strcmp(ptmmsm01["MAT_DESTION"], "01")) // 板坯长度4500——7000，并且去向是01，板坯去向更改为00
        {
          ptmmsm01["MAT_DESTION"] = "00";
        }
      }
    }

    if (0 == strcmp(ptmmsm01["MAT_DESTION"], "00"))
    {
      tqmts9cc["STRAND_NO"] = "00";
    }
    else if (0 == strcmp(ptmmsm01["MAT_DESTION"], "01"))
    {
      tqmts9cc["STRAND_NO"] = "01";
    }
    else
    {
      tqmts9cc["STRAND_NO"] = "10";
    }
    v_st_no = ptmmsm01["ST_NO"];
    Log::Trace("", "", "去向STRAND_NO[{0}]", tqmts9cc["STRAND_NO"]);
    Log::Trace("", "", "出钢记号ST_NO[{0}]", v_st_no);

    // 板坯头尾宽度处理（如果<700则认为宽度错误，取板坯的宽度作为头尾宽度）
    if (ptmmsm01["SLAB_HEAD_WIDTH"].ToDecimal() <= 650)
    {
      ptmmsm01["SLAB_HEAD_WIDTH"] = ptmmsm01["MAT_ACT_WIDTH"]; // 头宽
    }

    if (ptmmsm01["SLAB_TAIL_WIDTH"].ToDecimal() <= 650)
    {
      ptmmsm01["SLAB_TAIL_WIDTH"] = ptmmsm01["MAT_ACT_WIDTH"]; // 尾宽
    }

    /********根据硬度组获取TQMTS9CC表中规格允许参数数据***********/
    // 取出钢记号的前两位为作为特殊硬度组
    v_steel_group = ptmmsm01["ST_NO"].ToString().SubstringNE(0, 2);
    // 取出钢记号对应的硬度组、热送基准
    sqlstr =
        " SELECT HARDNESS_GROUP, SLAB_DHCR_CODE"
        "			   FROM TQMTS0X"
        "			   WHERE ST_NO = @v_st_no";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("v_st_no", v_st_no);
    cmd.ExecuteReader();

    if (cmd.Read())
    {
      v_hardness_group = cmd.GetString(1);
      v_slab_dhcr_code = cmd.GetString(2);
    }
    cmd.Close();
    Log::Trace("", "", "出钢记号前两位[{0}]", v_steel_group);

    sqlstr = " SELECT SLAB_FIX_S_MAX, SLAB_FIX_S_MIN, SLAB_FIX_L_MAX, SLAB_FIX_L_MIN, SLAB_MAX_WIDTH, SLAB_MIN_WIDTH, SLAB_TAPPER_WIDTH_LMT, SLAB_DENSITY"
             "			   FROM TQMTS9CC"
             "			   WHERE STRAND_NO = @STRAND_NO"
             "			   AND STEEL_GROUP_CODE = @v_steel_group"
             "			   FETCH FIRST 1 ROWS ONLY";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("STRAND_NO", tqmts9cc["STRAND_NO"].ToString());
    cmd.Parameters.Set("v_steel_group", v_steel_group);
    cmd.ExecuteReader();

    if (cmd.Read())
    {
      cmd.Fetch(tqmts9cc);
      cmd.Close();
    }
    else // 找不到特殊硬度组对应的数据
    {
      cmd.Close();
      EDLog(1, 1, "没有找到特定出钢记号");
      Log::Trace("", "", "取硬度组[{0}]的规格标准范围", v_hardness_group);

      // 取硬度组对应的常用系数
      sqlstr = " SELECT SLAB_FIX_S_MAX, SLAB_FIX_S_MIN, SLAB_FIX_L_MAX, SLAB_FIX_L_MIN, SLAB_MAX_WIDTH, SLAB_MIN_WIDTH, SLAB_TAPPER_WIDTH_LMT, SLAB_DENSITY"
               "				   FROM TQMTS9CC"
               "				   WHERE STRAND_NO = @STRAND_NO"
               "				   AND STEEL_GROUP_CODE = @v_hardness_group"
               "				   FETCH FIRST 1 ROWS ONLY";
      cmd.SetCommandText(sqlstr);
      cmd.Parameters.Set("STRAND_NO", tqmts9cc["STRAND_NO"].ToString());
      cmd.Parameters.Set("v_hardness_group", v_hardness_group);
      cmd.ExecuteReader();

      if (cmd.Read())
      {

        cmd.Fetch(tqmts9cc);
        cmd.Close();
      }
      else
      {
        cmd.Close();

        EDLog(1, 1, "没有硬度组对应标准，取默认值！");
        sqlstr = " SELECT SLAB_FIX_S_MAX, SLAB_FIX_S_MIN, SLAB_FIX_L_MAX, SLAB_FIX_L_MIN, SLAB_MAX_WIDTH, SLAB_MIN_WIDTH, SLAB_TAPPER_WIDTH_LMT, SLAB_DENSITY"
                 "					   FROM TQMTS9CC"
                 "					   WHERE STRAND_NO = @STRAND_NO"
                 "					   AND STEEL_GROUP_CODE = '00'"
                 "					   FETCH FIRST 1 ROWS ONLY";
        cmd.SetCommandText(sqlstr);
        cmd.Parameters.Set("STRAND_NO", tqmts9cc["STRAND_NO"].ToString());
        cmd.ExecuteReader();
        if (cmd.Read())
        {

          cmd.Fetch(tqmts9cc);
          cmd.Close();
        }
        else
        {
          Log::Trace("", "", "没有获取到TQMTS9CC表的内容");
          sprintf(s.msg, "没有获取到TQMTS9CC表的内容");
          // throw CApplicationException(-1, s.msg, log.Location);
          return doFlag;
        }
        cmd.Close();
      }
    }

    // 20221028：根据王劲松联系，强制热送2热轧01的板坯头尾宽差允许为50mm
    // if((0 == strcmp(ptmmsm01["HOT_SEND_FLAG"],"2")||0 == strcmp(ptmmsm01["HOT_SEND_FLAG"],"3"))&& 0 == strcmp(ptmmsm01["MAT_DESTION"],"01"))
    //{
    //	tqmts9cc["SLAB_TAPPER_WIDTH_LMT"] = 50;
    // }

    Log::Trace("", "", "宽差[{0}]宽度判定要求[{1}]", tqmts9cc["SLAB_TAPPER_WIDTH_LMT"], tqmts9cc["SLAB_DENSITY"]);

    /*********************条件判断**********************/
    /*分长度范围判断和调宽判断，范围值从QMTS9M画面中根据板坯去向进行取值。板坯长款等符合，则进入下一次判断，不符合则获取静态表中的值，全部符合则跳出结束*/
    // 调宽坯处理(头尾宽差超过4mm的认为是调宽坯)
    if (fabs(ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble() - ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble()) > 4 || (strlen(ptmmsm01["PREC_SLAB_NO"]) == 9 && (ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() > ptmmsm01["SLAB_WIDTH_MAX_NOM"].ToDouble() + 4 || ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble() > ptmmsm01["SLAB_WIDTH_MAX_NOM"].ToDouble() + 4)))
    {
      // 取板坯的最小宽度
      if (ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() > ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble())
      {
        v_slab_width_min = ptmmsm01["SLAB_TAIL_WIDTH"]; // 最小宽度
      }
      else
      {
        v_slab_width_min = ptmmsm01["SLAB_HEAD_WIDTH"]; // 最小宽度
      }
      // 板坯最大允许宽度
      if ((v_slab_width_max_plan < 650) || fabs(v_slab_width_max_plan - v_slab_width_min_plan) < 5)
      {
        v_slab_width_max = v_slab_width_min + tqmts9cc["SLAB_TAPPER_WIDTH_LMT"].ToDouble();
      }
      else
      {
        if ((v_slab_width_max_plan - v_slab_width_min) > tqmts9cc["SLAB_TAPPER_WIDTH_LMT"].ToDouble())
        {
          v_slab_width_max = v_slab_width_min + tqmts9cc["SLAB_TAPPER_WIDTH_LMT"].ToDouble();
        }
        else
        {
          v_slab_width_max = v_slab_width_max_plan;
        }
      }

      if (v_slab_width_max - v_slab_width_min < 15) // 允许范围太小，不方便二次切割
      {
        if (v_slab_width_min - 10 >= v_slab_width_min_plan)
          v_slab_width_min = v_slab_width_min - 10;
      }

      Log::Trace("", "", "允许的最小宽度[{0}]", v_slab_width_min);
      Log::Trace("", "", "允许的最大宽度[{0}]", v_slab_width_max);

      if (v_slab_width_max > tqmts9cc["SLAB_MAX_WIDTH"].ToDouble())
      {
        v_slab_width_max = tqmts9cc["SLAB_MAX_WIDTH"];
      }
      if (v_slab_width_min < tqmts9cc["SLAB_MIN_WIDTH"].ToDouble())
      {
        v_slab_width_min = tqmts9cc["SLAB_MIN_WIDTH"];
      }

      // 对板坯头尾宽度进行处理
      if ((ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() > v_slab_width_max) && (ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() < v_slab_width_max + 5))
      {
        // 对板坯宽度进行修约
        ptmmsm01["SLAB_HEAD_WIDTH"] = v_slab_width_max;
        ptmmsm01["SLAB_TAIL_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_TAIL_WIDTH"]);
      }
      else if ((ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble() > v_slab_width_max) && (ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble() < v_slab_width_max + 5))
      {
        // 对板坯宽度进行修约
        ptmmsm01["SLAB_TAIL_WIDTH"] = v_slab_width_max;
        ptmmsm01["SLAB_HEAD_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_HEAD_WIDTH"]);
      }
      else
      {
        // 对板坯宽度进行修约
        ptmmsm01["SLAB_HEAD_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_HEAD_WIDTH"]);
        ptmmsm01["SLAB_TAIL_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_TAIL_WIDTH"]);
      }

      // 条件2 板坯宽度在宽度下限范围
      if (tqmts9cc["SLAB_DENSITY"].ToDouble() == 0 && fabs(ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() - ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble()) <= tqmts9cc["SLAB_TAPPER_WIDTH_LMT"].ToDouble() + 4)
      {
        EDLog(1, 1, "头尾款差在允许范围内，并且不要求匹配计划!");
        find_flag = 1;
      }
      else if (ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() > v_slab_width_max || ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble() > v_slab_width_max)
      {
        find_flag = 0;
        for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
        {
          tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
          if (v_slab_dhcr_code == tqmts9ce["SLAB_DEAL_FLAG"].ToString() && tqmts9ce["SLAB_DEAL_TYPE"].ToString() == "16" && tqmts9ce["SLAB_DIRECTION"].ToString() == ptmmsm01["MAT_DESTION"].ToString())
          {
            find_flag = 1;
            break;
          }
          else
            continue;
        }
        if (find_flag)
        {
          Log::Trace("", "", "板坯号规格判断1[{0}]", find_flag);
          sprintf(hold_cause_remark, "头尾宽度范围[%.0f ~ %0.f]", v_slab_width_min, v_slab_width_max);
          // ptmmsm01["SLAB_WIDTH_MAX_NOM"] = v_slab_width_max;
          // ptmmsm01["SLAB_WIDTH_MIN_NOM"] = v_slab_width_min;
          // 数据处理
          tqmts9ce["HOLD_CAUSE_REMARK"] = hold_cause_remark;
          f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
          hsf_flag = 1;
        }
        else
        {
          find_flag = 0;
          for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
          {
            tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
            if (0 == strcmp(v_slab_dhcr_code, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"], "16") && 0 == strcmp(tqmts9ce["SLAB_DIRECTION"], "XX"))
            {
              find_flag = 1;
              break;
            }
            else
              continue;
          }
          if (find_flag)
          {
            Log::Trace("", "", "板坯号规格判断2[{0}]", find_flag);
            sprintf(hold_cause_remark, "头尾宽度范围[%.0f ~ %0.f]", v_slab_width_min, v_slab_width_max);
            // ptmmsm01["SLAB_WIDTH_MAX_NOM"] = v_slab_width_max;
            // ptmmsm01["SLAB_WIDTH_MIN_NOM"] = v_slab_width_min;
            // 数据处理
            tqmts9ce["HOLD_CAUSE_REMARK"] = hold_cause_remark;
            f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
            hsf_flag = 1;
          }
          else
          {
            find_flag = 0;
            for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
            {
              tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
              if (0 == strcmp("BT", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(tqmts9ce["SLAB_DEAL_TYPE"], "16") && 0 == strcmp(tqmts9ce["SLAB_DIRECTION"], ptmmsm01["MAT_DESTION"]))
              {
                find_flag = 1;
                break;
              }
              else
                continue;
            }
            if (find_flag)
            {
              Log::Trace("", "", "板坯号规格判断3[{0}]", find_flag);
              if (2 < atoi(tqmts9ce["HAND_FLAG"]))
              {
                sprintf(hold_cause_remark, "头尾宽度范围[%.0f ~ %0.f]", v_slab_width_min, v_slab_width_max);
              }
              // ptmmsm01["SLAB_WIDTH_MAX_NOM"] = v_slab_width_max;
              // ptmmsm01["SLAB_WIDTH_MIN_NOM"] = v_slab_width_min;
              // 数据处理
              tqmts9ce["HOLD_CAUSE_REMARK"] = hold_cause_remark;
              f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
              hsf_flag = 1;
            }
            else
            {
              // 前面头尾宽差判断时增加了偏移量，再这里对偏移量进行处理，确保送热轧板坯显示宽差不超50mm
              if (abs(ptmmsm01["HEAD_TAIL_WITH_DIFF"].ToDouble()) > 50 && 0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "1"))
                ptmmsm01["HEAD_TAIL_WITH_DIFF"] = 50;
            }
          }
        }
      }
      // 对有预定板坯号板坯，需要对宽度范围进行判断（板坯宽度是否在预定板坯号允许的轧制范围内，不在则取消预定板坯号和合同号）//20230324:在切断实绩中判断
      // if( 0 == find_flag && strlen(ptmmsm01["PREC_SLAB_NO"]) ==9 && 0 == strcmp(ptmmsm01["CHG_ST_NO_TYPE"]," "))
      //{
      //	if((ptmmsm01["SLAB_HEAD_WIDTH"] > ptmmsm01["SLAB_WIDTH_MAX_NOM"] + 15 ||ptmmsm01["SLAB_TAIL_WIDTH"] > ptmmsm01["SLAB_WIDTH_MAX_NOM"] + 15)
      //		||(ptmmsm01["SLAB_HEAD_WIDTH"] < ptmmsm01["SLAB_WIDTH_MIN_NOM"] - 15 ||ptmmsm01["SLAB_TAIL_WIDTH"] < ptmmsm01["SLAB_WIDTH_MIN_NOM"] - 15))
      //	{
      //		EDLog(1,1,"板坯宽度不满足计划要求范围！！！");
      //		ptmmsm01["PREC_SLAB_NO"] = " ";//预定板坯号置空
      //		ptmmsm01["NO_CAUSE"] = "1";//未赋号理由
      //		strcpy(ptmmsm01["ORDER_NO"]," ");//合同号
      //	}
      // }
    }
    else
    {
      // 对板坯宽度进行修约
      ptmmsm01["SLAB_HEAD_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_HEAD_WIDTH"]);
      ptmmsm01["SLAB_TAIL_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["SLAB_TAIL_WIDTH"]);
    }

    // 对板坯宽度进行修约
    ptmmsm01["MAT_ACT_WIDTH"] = f_qmbs_slab_width_round(ptmmsm01["MAT_ACT_WIDTH"]);

    // 板坯宽度判定
    if ((ptmmsm01["MAT_ACT_WIDTH"].ToDouble() >= tqmts9cc["SLAB_MIN_WIDTH"].ToDouble()) && (ptmmsm01["MAT_ACT_WIDTH"].ToDouble() <= tqmts9cc["SLAB_MAX_WIDTH"].ToDouble()) || hsf_flag == 1)
    {
      EDLog(1, 1, "板坯宽度符合要求，不做数据处理！");
    }
    else
    {
      EDLog(1, 1, "板坯宽度处理！");

      sqlstr = " SELECT *"
               "				  FROM tqmts9ce"
               "				  WHERE SLAB_DEAL_TYPE = '11' AND SLAB_DEAL_FLAG = '2'"
               "				  FETCH FIRST 1 ROWS ONLY ";
      cmd.SetCommandText(sqlstr);
      cmd.ExecuteReader();
      if (cmd.Read())
      {
        cmd.Fetch(tqmts9ce);
      }
      cmd.Close();
      f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
    }

    // 条件1 板坯长度不在长定尺范围，或短定尺上下限范围；
    // 精整方法X2=2
    if (0 == strcmp(ptmmsm01["FINISH_MODE"], "2"))
    {
      EDLog(1, 1, "板坯需精整，不做数据处理！");
    }
    else if ((ptmmsm01["MAT_ACT_LEN"].ToDouble() >= tqmts9cc["SLAB_FIX_S_MIN"].ToDouble() && ptmmsm01["MAT_ACT_LEN"].ToDouble() <= tqmts9cc["SLAB_FIX_S_MAX"].ToDouble()) || (ptmmsm01["MAT_ACT_LEN"].ToDouble() >= tqmts9cc["SLAB_FIX_L_MIN"].ToDouble() && ptmmsm01["MAT_ACT_LEN"].ToDouble() <= tqmts9cc["SLAB_FIX_L_MAX"].ToDouble()))
    {
      EDLog(1, 1, "板坯长度符合允许范围，不做数据处理！");
    }
    else
    {
      if ((ptmmsm01["MAT_DESTION"].ToString() == "09" || ptmmsm01["MAT_DESTION"].ToString() == "10" || ptmmsm01["MAT_DESTION"].ToString() == "20") && ptmmsm01["PREC_SLAB_NO"].ToString().Trim() != "") // 考虑外供，有计划板坯和计划比较
      {
        EDLog(1, 1, "外供有计划板坯！");
        if (ptmmsm01["MAT_ACT_LEN"].ToDouble() <= (ptmmsm01["SLAB_LENGTH_MAX_NOM"].ToDouble() + 50) && ptmmsm01["MAT_ACT_LEN"].ToDouble() >= (ptmmsm01["SLAB_LENGTH_MIN_NOM"].ToDouble() - 30))
        {
          EDLog(1, 1, "板坯长度符合计划要求，不做数据处理！");
        }
        else
        {
          EDLog(1, 1, "板坯长度不满足计划要求，需处理！");
          sqlstr = " SELECT *"
                   "						  FROM tqmts9ce"
                   "						  WHERE SLAB_DEAL_TYPE = '11' AND SLAB_DEAL_FLAG = '1'"
                   "						  FETCH FIRST 1 ROWS ONLY ";
          cmd.SetCommandText(sqlstr);
          cmd.ExecuteReader();
          if (cmd.Read())
          {
            cmd.Fetch(tqmts9ce);
          }
          cmd.Close();
          f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
        }
      }
      else // 无计划板坯和允许范围比较
      {
        EDLog(1, 1, "无计划板坯长度处理！");
        sqlstr = " SELECT *"
                 "					  FROM tqmts9ce"
                 "					  WHERE SLAB_DEAL_TYPE = '11' AND SLAB_DEAL_FLAG = '1'"
                 "					  FETCH FIRST 1 ROWS ONLY ";
        cmd.SetCommandText(sqlstr);
        cmd.ExecuteReader();
        if (cmd.Read())
        {
          cmd.Fetch(tqmts9ce);
        }
        cmd.Close();
        f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
      }
    }

    // 条件3 |板坯宽度-头尾宽均值|<10
    if (fabs(ptmmsm01["MAT_ACT_WIDTH"].ToDouble() - (ptmmsm01["SLAB_HEAD_WIDTH"].ToDouble() + ptmmsm01["SLAB_TAIL_WIDTH"].ToDouble()) / 2) < 10)
    {
      EDLog(1, 1, "大小头符合条件，不做数据处理！");
    }
    else
    {
      EDLog(1, 1, "大小头处理！");
      sqlstr = " SELECT *"
               "				  FROM tqmts9ce"
               "				  WHERE SLAB_DEAL_TYPE = '11' AND SLAB_DEAL_FLAG = '3'"
               "				  FETCH FIRST 1 ROWS ONLY ";
      cmd.SetCommandText(sqlstr);
      cmd.ExecuteReader();
      if (cmd.Read())
      {
        cmd.Fetch(tqmts9ce);
      }
      cmd.Close();
      f_qmbs_data_proc(ptmmsm01, tqmts9ce, bcls_ret);
    }
  }
  catch (CDbException &ex)
  {
    CFormattable arguments[] = {ex.GetCode(), ex.GetMsg()};
    CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
    CString str = sqlstr + "\r\n" + ex.GetMsg();
    strncpy(s.sysmsg, (const char *)str, sizeof(s.sysmsg) - 1);
    s.flag = -1;
    doFlag = -1;
  }
  catch (CApplicationException &ex)
  {
    s.flag = ex.GetCode();
    doFlag = -1;
  }
  catch (CException &ex)
  {
    strcpy(s.msg, ex.GetMsg());
    s.flag = ex.GetCode();
    doFlag = -1;
  }
  return doFlag;
}

int f_qmbs_slab_width_round(float width_value)
{
  int width_value_after = 0;
  int a = 0;
  int b = 0;

  a = int(width_value / 10);
  b = int(width_value) % 10;

  if (b == 0)
  {
    width_value_after = width_value;
  }
  else if (b <= 3)
  {
    width_value_after = a * 10;
  }
  else if (b <= 6)
  {
    width_value_after = a * 10 + 5;
  }
  else
  {
    width_value_after = (a + 1) * 10;
  }

  return width_value_after;
} // 板坯宽度修约
