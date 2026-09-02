/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
*  程序名称   : f_qmbs_chag_stno
*  程序描述   : 改钢判定
*  备注说明   :
*  创建日期   : 2016-05-31 wei.cx
*  修改历史   : 2021-04-18 zhenglie（功能扩展 + 针对性要求处置）
2023-05-18 panchen: 代码转最新框架
*  模型说明   :
*              1、通过改钢标记进入改钢模型（无改钢标记则表示不需要改钢）
*              2、静态表配置中通过辅助代码区别不同操作
*                 A：A1的对改钢标记进行分流（首次分流可以用出钢记号 + 改钢标记进行细分）
*                 B：质量改钢标记10 + 模型改钢15对应改钢事件;(B1)
*                 C：混浇改钢标记20对应改钢事件;(C1（正常）、C2（特例）)
*                 D：工艺改钢标记30对应改钢事件;(D1)
*                 E：针对混浇的特殊判定(E1)
*                 F：对混浇有特殊判定要求的出钢记号进行固定(F1)
*                 G：对特殊要求、异常情况的判定(G1（异常）、G2（特例）)
*              3、混浇改钢C流程需要在相邻混浇钢种中找优先改钢钢种（元素特殊要求 + 硬度组）
*              4、改钢中需要考虑工艺卡规定的特殊元素要求
*              5、炉次YY封锁将影响最终判定（等待炉次判定）
*              6、改钢流程将不影响板坯的处置要求（精整、清理要求），只对最终出钢记号进行处置
*              7、slab_deal_flag中特殊代码含义：
*                 A1 超低C钢处理 GG000010
*                 A2 高P高Cu钢处理 GG000020
*                 A3 数据不全 (YY000030)
*                 A4 高P超低C钢处理 GG000040
*                 A5 混浇硬度等级差>=3，人工确定 (YY000050)
*                 Y1 炉次YY (YY000010)
*                 Y2 相邻炉次YY (YY000020)
**************************************************/

#include "stdafx.h"

BM2_FUNCTION_EXPORT
int f_qmbs_data_proc(CModel &ptmmsm01, CModel &ptqmts9ce, EIClass *bcls_ret);

int f_qmbs_chag_stno(CModel &ptmmsm01, CModel &ptqmts0x, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  try
  {
    int ret = 0;
    CString msg = " ";
    int blkNum = 0;
    int find_flag = 0;
    CString v_mat_destion = "00";
    CString Y17_new_slab_direction = " ";
    CString slab_no_place = " ";
    int slab_yy_flag = 0;
    int slab_yy_flag_1 = 0;             // 本炉因成份YY封锁
    int slab_yy_flag_2 = 0;             // 前相邻因成份YY封锁
    int slab_yy_flag_pre = 0;           // 前炉因成份YY封锁
    int slab_yy_flag_nxt = 0;           // 后炉因成份YY封锁
    CString v_hardness_group_chg = " "; // 改钢用的硬度组
    int v_elm_flag = 0;
    CString v_st_no_chg = " "; // 改钢用出钢记号
    // char v_st_no_yy_1[9] = " ";
    // char v_st_no_yy_pre[9] = " ";
    // char v_st_no_yy_nxt[9] = " ";
    int counter_for = 0;
    CString n1 = "00";
    EIClass bcls_temp;

    /*标准查询格式使用*/
    CString v_a = " ";
    CString v_b = "XX";
    CString v_d = "XX";
    CString v_e = "0";
    CString v_f = "0";
    CString v_m = "X";
    /*标准查询格式使用*/

    /* ***** 程序表结构引用 ***** */
    // char v_mat_no[15] = " ";
    CString v_heat_no = " ";
    CString heat_confm_flag = " ";
    CString cmpstr = " ";
    long slab_len_good = 0;
    CString v_cast_no = " ";
    int v_cast_div_no = 0;
    CString prev_heat_st_no = " ";
    CString next_heat_st_no = " ";
    int q_diff = 0;
    CString q = " ";
    double elm_std_aim = 0;
    double elm_c = 9.99; // 避免找不到值时0值误判
    double elm_p = 0;
    double elm_Cu = 0;
    double elm_Mn = 0;
    double elm_CEQ = 0;
    double elm_c2 = 9.99; // 避免找不到值时0值误判
    double elm_p2 = 0;
    double elm_Cu2 = 0;
    double elm_Mn2 = 0;
    double elm_CEQ2 = 0;
    CString st_no_tmp = " ";
    CString elm_code = " ";
    CString st_no2 = " "; // 相邻炉次的出钢记号
    CString st_no1 = " "; // 调用板坯的出钢记号
    CString st_no_q_max = " ";
    CString st_no_q_min = " ";
    CString v_hardness_group1 = " ";
    CString v_hardness_group2 = " ";
    CString v_slab_deal_type = "00"; // 模块代码
    CModel tqmts9ce("TQMTS9CE");
    CModel tqmts23("TQMTS23");
    CDbCommand cmd(conn);
    CModel tqmts9ce_tmp("TQMTS9CE");
    // 计划改钢标记判断，获取对应的改钢路径
    if (ptmmsm01["CHG_ST_NO_FLAG"].ToString().Substring(0, 1) == ' ') // 改钢标记
    {
      Log::Trace("", "", "计划改钢标识 = [%s]为空，不处理", ptmmsm01["CHG_ST_NO_FLAG"]);
      doFlag = 0;
      return 0;
    }

    //--------------取板坯号的顺序号-----------------
    if (13 == ptmmsm01["MAT_NO"].ToString().GetLength())
    {
      n1 = ptmmsm01["MAT_NO"].ToString().SubstringNE(10, 2);
    }

    // 参数处理
    v_heat_no = ptmmsm01["HEAT_NO"]; // 熔炼号
    if (ptmmsm01["FIN_ST_NO"].ToString().Trim() != "" && ptmmsm01["DECI_ST_NO"].ToString() != "YY000000")
      st_no1 = ptmmsm01["FIN_ST_NO"]; // b:有最终出钢记号(YY封锁)则选择最终出钢记号
    else
      st_no1 = ptmmsm01["PREC_ST_NO"];              // b:否则选择预定出钢记号
    v_cast_no = ptmmsm01["CAST_NO"];                // Cast号
    v_cast_div_no = ptmmsm01["CAST_DIV_NO"];        // Cast 顺序号
    v_hardness_group1 = ptqmts0x["HARDNESS_GROUP"]; // 硬度组1
    if (0 != strcmp(ptmmsm01["MAT_DESTION"], "01"))
      v_mat_destion = "00"; // 板坯去向
    Log::Trace("", "", "line PREC_ST_NO = {0}", ptmmsm01["PREC_ST_NO"]);
    Log::Trace("", "", "line FIN_ST_NO = {0}", ptmmsm01["FIN_ST_NO"]);
    Log::Trace("", "", " mat_no=[{0}]，v_heat_no=[{1}]，st_no1=[{2}],v_hardness_group1=[{3}]", ptmmsm01["MAT_NO"], v_heat_no, st_no1, v_hardness_group1);

    // 定义游标：查询静态表TQMTS9CE（全部）(有效性 + 时间区间 + 处置类别)
    sqlstr =
        " SELECT  *"
        "		FROM  TQMTS9CE"
        "		WHERE SLAB_DEAL_TYPE = '20' "
        "           AND VALIDE_FLAG = '1' "
        "		ORDER BY ST_NO, MAT_POSITION, SLAB_DEAL_FLAG, REC_CREATE_TIME DESC";
    EIClass tqmts9ce_q;
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(tqmts9ce_q.Tables[0]);
    cmd.Close();

    // 2023.6.17
    /*" SELECT  ST_NO, CAST_DIV_NO, YY000000_CAUSE, FIN_ST_NO, DECI_ST_NO"
      "		FROM  tqmts23"
      "		WHERE  CAST_NO = @v_cast_no"
      "		AND  CAST_DIV_NO in(@v_cast_div_no - 1, @v_cast_div_no, @v_cast_div_no + 1)"
      "		UNION"
      "		SELECT  ST_NO, CAST_DIV_NO, YY000000_CAUSE, FIN_ST_NO, DECI_ST_NO"
      "		FROM  TPSSM51"
      "		WHERE  CAST_NO = @v_cast_no"
      "		AND  CAST_DIV_NO in(@v_cast_div_no - 1, @v_cast_div_no, @v_cast_div_no + 1)"
      ;*/
    // 定义游标：查找炉次信息
    Log::Trace("", "", "v_cast_no = {0}", v_cast_no = ptmmsm01["CAST_NO"]);
    sqlstr =
        " SELECT  ST_NO, CAST_DIV_NO, YY_CAUSE, FIN_ST_NO, DECI_ST_NO"
        "		FROM  TQMTS23"
        "		WHERE  CAST_NO = @v_cast_no"
        "		AND  CAST_DIV_NO in(@v_cast_div_no - 1, @v_cast_div_no, @v_cast_div_no + 1)";
    /*" SELECT  ST_NO, CAST_DIV_NO, YY000000_CAUSE, FIN_ST_NO, DECI_ST_NO"
    "		FROM  tqmts23"
    "		WHERE  CAST_NO = @v_cast_no"
    "		AND  CAST_DIV_NO in(@v_cast_div_no - 1, @v_cast_div_no, @v_cast_div_no + 1)"
    "		UNION"
    "		SELECT  ST_NO, CAST_DIV_NO, YY000000_CAUSE, FIN_ST_NO, DECI_ST_NO"
    "		FROM  TPSSM51"
    "		WHERE  CAST_NO = @v_cast_no"
    "		AND  CAST_DIV_NO in(@v_cast_div_no - 1, @v_cast_div_no, @v_cast_div_no + 1)";*/
    EIClass cast_div_no_q;
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("v_cast_no", v_cast_no);
    cmd.Parameters.Set("v_cast_div_no", v_cast_div_no);
    cmd.ExecuteQuery(cast_div_no_q.Tables[0]);
    cmd.Close();

    // 定义游标：取b1,b2出钢记号的C,P,Cu目标成分
    sqlstr =
        " SELECT MAIN_AIM, ELM_CODE, ST_NO"
        "		FROM TQMTS02"
        "		WHERE ST_NO in(@st_no1, @st_no2)"
        "		AND ELM_CODE in('012', '030', '064', '055', 'C01')";
    EIClass tqmts02_qb;
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("st_no1", st_no1);

    // 选择改钢路径
    Log::Trace("", "", "第一步：选择改钢路径");

    find_flag = 10; //"1"的优先级最高
    for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
    {
      tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
      if (0 == strcmp(ptmmsm01["CHG_ST_NO_FLAG"], tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("A1", tqmts9ce["ASS_DIF_CODE"]))
      {
        // 判断1 - 出钢记号 + 改钢标记：选择一个改钢路径
        find_flag = 1; //"1"的优先级最高
        Log::Trace("", "", "改钢路径选择处理1");
        tqmts9ce_tmp.CopyFrom(tqmts9ce);
        break;
      }
      else if (0 == strcmp(ptmmsm01["CHG_ST_NO_FLAG"], tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("A1", tqmts9ce["ASS_DIF_CODE"]))
      {
        // 判断2 - 改钢标记：选择一个改钢路径
        if (find_flag > 2)
        {
          find_flag = 2;
          Log::Trace("", "", "改钢路径选择处理2");
          tqmts9ce_tmp.CopyFrom(tqmts9ce);
        }
      }
      else
        continue;
    }

    // if (find_flag > 1 && find_flag < 10)

    if (find_flag != 10)
    {
      // 数据处理
      Log::Trace("", "", "匹配标记find_flag[{0}]", find_flag);
      Log::Trace("", "", "------找到改钢路径 = [{0}] ：方式号[{1}]------", tqmts9ce_tmp["NEW_SLAB_DIRECTION"], tqmts9ce_tmp["PATTERN_NO"]);
      // f_mmsm01_data_proc(ptmmsm01, &tqmts9ce, bcls_ret);
    }
    else
    {
      // 找不到改钢标记对应的改钢路径
      ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+改钢模型错误1，人工处置!";
      ptmmsm01["SURFACE_DECIDE_CODE"] = "4";
      Log::Trace("", "", "静态表中无对应的改钢路径，find_flag=[{0}]", find_flag);

      doFlag = 0;
      return 0;
      // 2023.6.17
      // throw CApplicationException(-1, s.msg, log.Location);
    }

    Log::Trace("", "", "NEW_SLAB_DIRECTION = {0}", tqmts9ce_tmp["NEW_SLAB_DIRECTION"].ToString().GetAt(0));
    // 进入改钢流程
    //  2023.6.17
    // if (tqmts9ce["NEW_SLAB_DIRECTION"].ToString().GetAt(0) != ' ')
    if (tqmts9ce_tmp["NEW_SLAB_DIRECTION"].ToString().Trim() != "")
    {

      Log::Trace("", "", "进行改钢流程处置！new_slab_direction=[{0}]", tqmts9ce_tmp["NEW_SLAB_DIRECTION"]);

      if (0 == strcmp("A1", tqmts9ce_tmp["ASS_DIF_CODE"]) && 0 == strcmp("1", tqmts9ce_tmp["SURFACE_DECIDE_CODE"]))
      {
        Log::Trace("", "", "该改钢路径不需要现在改钢处置!");
        doFlag = 0;
        return 0;
      }

      Y17_new_slab_direction = tqmts9ce_tmp["NEW_SLAB_DIRECTION"];

      // 获取炉次信息
      for (size_t i = 0; i < cast_div_no_q.Tables[0].Rows.get_Count(); i++)
      {
        tqmts23.MergeFrom(cast_div_no_q.Tables[0].Rows[i]);
        if (tqmts23["CAST_DIV_NO"].ToDecimal() == v_cast_div_no - 1) // 前炉YY
        {
          // 是否因为成份超标而判YY（如果是则需要等有最终结果了再判定）
          if ((0 == strcmp(tqmts23["YY_CAUSE"], "2") || 0 == strcmp(tqmts23["YY_CAUSE"], "72")) && 0 == strcmp(tqmts23["DECI_ST_NO"], "YY000000") && 0 == strcmp(tqmts23["FIN_ST_NO"], " "))
          {
            slab_yy_flag_pre = 1; // 前炉YY
          }
          // 获取上一炉信息
          if (0 == strcmp(tqmts23["FIN_ST_NO"], " ")) // 如果有最终出钢记号则用最终出钢记号进行判定
            prev_heat_st_no = tqmts23["ST_NO"];
          else
            prev_heat_st_no = tqmts23["FIN_ST_NO"];
          Log::Trace("", "", "上炉出钢记号st_no=[{0}],浇次顺序号cast_div_no=[{1}],slab_yy_flag_pre=[{2}]", prev_heat_st_no, tqmts23["CAST_DIV_NO"], slab_yy_flag_pre);
        }
        else if (tqmts23["CAST_DIV_NO"].ToDecimal() == v_cast_div_no) // 本炉YY
        {
          // 是否因为成份超标而判YY（如果是则需要等有最终结果了再判定）
          if ((0 == strcmp(tqmts23["YY_CAUSE"], "2") || 0 == strcmp(tqmts23["YY_CAUSE"], "72")) && 0 == strcmp(tqmts23["DECI_ST_NO"], "YY000000") && 0 == strcmp(tqmts23["FIN_ST_NO"], " "))
          {
            slab_yy_flag_1 = 1; // 本炉YY
          }
          // 获取本炉信息
          if (0 == strcmp(st_no1, " ")) // 如果板坯的出钢记号为空则取炉次的，否则用板坯的
          {
            if (0 != strcmp(tqmts23["FIN_ST_NO"], " ")) // 如果有最终出钢记号则用最终出钢记号进行判定
              st_no1 = tqmts23["FIN_ST_NO"];
            else
              st_no1 = tqmts23["ST_NO"];
          }
          Log::Trace("", "", "本炉出钢记号st_no=[{0}],浇次顺序号cast_div_no=[{1}],slab_yy_flag_1=[{2}]", st_no1, tqmts23["CAST_DIV_NO"], slab_yy_flag_1);
        }
        else if (tqmts23["CAST_DIV_NO"].ToDecimal() == v_cast_div_no + 1) // 下炉YY
        {
          // 是否因为成份超标而判YY（如果是则需要等有最终结果了再判定）
          if ((0 == strcmp(tqmts23["YY_CAUSE"], "2") || 0 == strcmp(tqmts23["YY_CAUSE"], "72")) && 0 == strcmp(tqmts23["DECI_ST_NO"], "YY000000") && 0 == strcmp(tqmts23["FIN_ST_NO"], " "))
          {
            slab_yy_flag_nxt = 1; // 后炉YY
          }
          // 获取下一炉信息
          if (0 == strcmp(tqmts23["FIN_ST_NO"], " ")) // 如果有最终出钢记号则用最终出钢记号进行判定
            next_heat_st_no = tqmts23["ST_NO"];
          else
            next_heat_st_no = tqmts23["FIN_ST_NO"];
          Log::Trace("", "", "下炉出钢记号st_no=[{0}],浇次顺序号cast_div_no=[{1}],slab_yy_flag_nxt=[{2}]", next_heat_st_no, tqmts23["CAST_DIV_NO"], slab_yy_flag_nxt);
        }
      }

      // 获取炉次信息end

      // 相邻出钢记号确定
      Log::Trace("", "", "---------相邻出钢记号确定------------------");
      if (Y17_new_slab_direction[0] == 'C' || Y17_new_slab_direction[0] == 'E')
      {
        // wei.cx2016-7-7 mat_position改为SLAB_PLACE_CODE(混浇改钢需要考虑前后炉的出钢记号)
        // B、T坯混浇不考虑相邻混浇炉次信息
        if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "S" || strcmp("01", n1) == 0) // zhenglei：新增加位置S
        {
          st_no2 = prev_heat_st_no;
          slab_yy_flag_2 = slab_yy_flag_pre;
        }
        else if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "R") // zhenglei：新增加位置R
        {
          st_no2 = next_heat_st_no;
          slab_yy_flag_2 = slab_yy_flag_nxt;
        }
        else if (ptmmsm01["SLAB_PLACE_CODE"].ToString() == "B" || ptmmsm01["SLAB_PLACE_CODE"].ToString() == "T") // zhenglei：新增加位置B、T
          st_no2 = " ";
        else
        {
          if (13 == ptmmsm01["MAT_NO"].ToString().GetLength())
          {
            slab_no_place = ptmmsm01["MAT_NO"].ToString().SubstringNE(10, 2);
          }
          // 根据板坯最后两位顺序号决定是与上炉混浇还是与下炉混浇
          if (atoi(slab_no_place) > 2)
          {
            st_no2 = next_heat_st_no; // 炉次头部板坯取上炉钢种
            slab_yy_flag_2 = slab_yy_flag_nxt;
          }
          else
          {
            st_no2 = prev_heat_st_no; // 炉次尾部板坯取下炉钢种
            slab_yy_flag_2 = slab_yy_flag_pre;
          }
        }
        Log::Trace("", "", "混浇出钢记号1=[{0}],混浇出钢记号2=[{1}]", st_no1, st_no2);
        Log::Trace("", "", "slab_yy_flag_1=[{0}],slab_yy_flag_2=[{1}]", slab_yy_flag_1, slab_yy_flag_2);
      }
      else
      {
        Log::Trace("", "", " 非混浇改钢，只考虑当前炉次出钢记号!");
        st_no2 = " ";
      }
      // 查询
      cmd.Parameters.Set("st_no2", st_no2);
      cmd.ExecuteQuery(tqmts02_qb.Tables[0]);
      cmd.Close();

      Log::Trace("", "", "---------b1,b2目标成分读取Begin---------");
      v_elm_flag = 0;
      // 获取两个出钢记号的元素值
      for (size_t i = 0; i < tqmts02_qb.Tables[0].Rows.get_Count(); i++)
      {
        elm_std_aim = tqmts02_qb.Tables[0].Rows[i]["MAIN_AIM"];
        elm_code = tqmts02_qb.Tables[0].Rows[i]["ELM_CODE"];
        st_no_tmp = tqmts02_qb.Tables[0].Rows[i]["ST_NO"];
        if (strcmp("012", elm_code) == 0 && strcmp(st_no1, st_no_tmp) == 0)
        {
          elm_c = elm_std_aim;
          v_elm_flag++;
        }
        else if (strcmp("030", elm_code) == 0 && strcmp(st_no1, st_no_tmp) == 0)
          elm_p = elm_std_aim;
        else if (strcmp("064", elm_code) == 0 && strcmp(st_no1, st_no_tmp) == 0)
          elm_Cu = elm_std_aim;
        else if (strcmp("055", elm_code) == 0 && strcmp(st_no1, st_no_tmp) == 0)
          elm_Mn = elm_std_aim;
        else if (strcmp("C01", elm_code) == 0 && strcmp(st_no1, st_no_tmp) == 0)
          elm_CEQ = elm_std_aim;
        else if (strcmp("012", elm_code) == 0 && strcmp(st_no2, st_no_tmp) == 0)
        {
          elm_c2 = elm_std_aim;
          v_elm_flag++;
        }
        else if (strcmp("030", elm_code) == 0 && strcmp(st_no2, st_no_tmp) == 0)
          elm_p2 = elm_std_aim;
        else if (strcmp("064", elm_code) == 0 && strcmp(st_no2, st_no_tmp) == 0)
          elm_Cu2 = elm_std_aim;
        else if (strcmp("055", elm_code) == 0 && strcmp(st_no2, st_no_tmp) == 0)
          elm_Mn2 = elm_std_aim;
        else if (strcmp("C01", elm_code) == 0 && strcmp(st_no2, st_no_tmp) == 0)
          elm_CEQ2 = elm_std_aim;
      }
      Log::Trace("", "", "---------b1,b2目标成分读取End---------");

      // 混浇相邻钢种查找
      if (Y17_new_slab_direction[0] == 'C' || Y17_new_slab_direction[0] == 'E')
      {
        Log::Trace("", "", "---------计算混浇改钢的对应出钢记号---------");
        if (0 == strcmp(st_no2, " ") || 0 == strcmp(st_no1, " "))
        {
          v_st_no_chg = "YY000030"; // 数据不全
          slab_yy_flag = 3;         // 没有找到对应的混浇出钢记号
          v_hardness_group_chg = "A3";
          Y17_new_slab_direction = "G1";
          Log::Trace("", "", "混浇炉次有空出钢记号,数据不全,v_st_no_chg = [{0}],v_hardness_group_chg=[{1}]", v_st_no_chg, v_hardness_group_chg);
        }
        else // 根据两个出钢记号选择改钢参照出钢记号（先硬度优先，硬度相同的参照具体元素）
        {
          Log::Trace("", "", "---------根据硬度组选择---------");
          sqlstr = " SELECT abs(HARDNESS_GROUP - @v_hardness_group1), HARDNESS_GROUP"
                   "					   FROM TQMTS0X"
                   "					   WHERE ST_NO = @st_no2 ";
          cmd.SetCommandText(sqlstr);
          cmd.Parameters.Set("st_no2", st_no2);
          cmd.Parameters.Set("v_hardness_group1", v_hardness_group1);
          cmd.ExecuteReader();
          if (cmd.Read())
          {
            q_diff = cmd.GetInt32(1);
            v_hardness_group2 = cmd.GetString(2);
            if (q_diff >= 3) // 硬度组差值超3个等级，系统提交给操作人员确定
            {
              v_st_no_chg = "YY000050";
              slab_yy_flag = 5;
              v_hardness_group_chg = "A5";
              Y17_new_slab_direction = "G1";
              Log::Trace("", "", "硬度等级差>2,q_diff=[{0}],v_st_no_chg = [{1}],v_hardness_group_chg=[{2}]", q_diff, v_st_no_chg, v_hardness_group_chg);
            }
            else
            {
              //--------------选择出钢记号---------------(2018-7:增加Mn 和C当量的识别)
              // 以下程序对通过静态表查找决定是否有需要特殊处理的改钢改钢（有点复杂了）
              // 静态表读值 wei.cx2016-7-12 固定值"B2"改为 Y17_new_slab_direction（对特殊要求的出钢记号进行处理，优先选择有特殊要求的，先大后小）(F1)
              find_flag = 10; //"1"的优先级最高
              for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
              {
                tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
                if (0 == strcmp(st_no2, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("F1", tqmts9ce["ASS_DIF_CODE"]))
                {
                  // 判断1 - 本炉出钢记号 + 相邻炉出钢记号 + 识别代码F1：查找对应的改钢参照出钢记号tqmts9ce["NEW_ST_NO"]
                  find_flag = 1; //"1"的优先级最高
                  Log::Trace("", "", "混浇出钢记号选择1：本炉出钢记号 + 相邻炉出钢记号");
                  tqmts9ce_tmp.CopyFrom(tqmts9ce);
                  break;
                }
                else if (0 == strcmp(st_no1, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(st_no2, tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("F1", tqmts9ce["ASS_DIF_CODE"]))
                {
                  // 判断2 - 相邻炉出钢记号 + 本炉出钢记号 + 识别代码F1：查找对应的改钢参照出钢记号tqmts9ce["NEW_ST_NO"]
                  if (find_flag > 2)
                  {
                    find_flag = 2;
                    tqmts9ce_tmp.CopyFrom(tqmts9ce);
                    Log::Trace("", "", "混浇出钢记号选择2：相邻炉出钢记号 + 本炉出钢记号");
                  }
                }
                else if (0 == strcmp("XX", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("F1", tqmts9ce["ASS_DIF_CODE"]))
                {
                  // 判断3 - 本炉出钢记号 + 识别代码F1：查找对应的改钢参照出钢记号tqmts9ce["NEW_ST_NO"]
                  if (find_flag > 3)
                  {
                    find_flag = 3;
                    tqmts9ce_tmp.CopyFrom(tqmts9ce);
                    Log::Trace("", "", "混浇出钢记号选择3：本炉出钢记号");
                  }
                }
                else if (0 == strcmp("XX", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(st_no2, tqmts9ce["ST_NO"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("F1", tqmts9ce["ASS_DIF_CODE"]))
                {
                  // 判断4 - 相邻炉出钢记号 + 识别代码F1：查找对应的改钢参照出钢记号tqmts9ce["NEW_ST_NO"]
                  if (find_flag > 4)
                  {
                    find_flag = 4;
                    tqmts9ce_tmp.CopyFrom(tqmts9ce);
                    Log::Trace("", "", "混浇出钢记号选择4：相邻炉出钢记号");
                  }
                }
                else
                  continue;
              }

              if (find_flag != 10)
              {
                // 数据处理
                v_st_no_chg = tqmts9ce_tmp["NEW_ST_NO"];
                Log::Trace("", "", "有特殊改钢要求的出钢记号存在=[{0}]", v_st_no_chg);
              }
              else if (2 > v_elm_flag) // 没有找到成份
              {
                v_st_no_chg = "YY000030"; // 数据不全
                v_hardness_group_chg = "A3";
                Y17_new_slab_direction = "G1";
                slab_yy_flag = 3;
                Log::Trace("", "", "混浇炉次成份数据不全,v_st_no_chg = [{0}],v_hardness_group_chg=[{0}]", v_st_no_chg, v_hardness_group_chg);
              }
              else if (0 == strcmp(v_hardness_group1, "01") && 0 == strcmp(v_hardness_group2, "01")) // 硬度等级01的再分类,根据C、P、Mn选择最优改钢出钢记号
              {
                Log::Trace("", "", "硬度等级都是01的");
                v_st_no_chg = st_no1;                  // 默认选择本炉出钢记号
                v_hardness_group_chg = "01";           // 非混浇坯不需要考虑前后炉次的出钢记号
                if (elm_c <= 0.008 && elm_c2 <= 0.008) // 都是超低C钢
                {
                  Log::Trace("", "", "同时目标C都<=0.008");
                  if (elm_p < elm_p2)
                  {
                    // 取st_no2
                    v_st_no_chg = st_no2; // zhenglei：取对应的出钢记号
                    Log::Trace("", "", "目第二个出钢记号P值大,elm_p2[{0}]", elm_p2);
                  }
                }
                else
                {
                  if (elm_Mn < elm_Mn2)
                  {
                    // 取st_no2
                    v_st_no_chg = st_no2; // zhenglei：两个出钢记号有一个不满足条件
                    Log::Trace("", "", "硬度等级01，但第二个出钢记号Mn值大，elm_Mn2[{0}]", elm_Mn2);
                  }
                }
              }
              else // 有硬度等级大于01的
              {
                // 对混浇出钢记号没有特殊要求，通过对特殊元素决定混浇改钢出钢记号
                if (elm_p >= 0.05 && elm_Cu >= 0.1) // P、Cu
                {
                  v_st_no_chg = st_no1; // zhenglei：取P、Cu满足条件的出钢记号
                }
                else if (elm_p2 >= 0.05 && elm_Cu2 >= 0.1)
                {
                  v_st_no_chg = st_no2;
                }
                else if (0 == strcmp(v_hardness_group1, v_hardness_group2)) // 两个硬度等级相同
                {
                  v_hardness_group_chg = v_hardness_group1;
                  if (elm_CEQ < elm_CEQ2) // 同硬度的选择C当量高的一个
                  {
                    // 取st_no2
                    v_st_no_chg = st_no2;
                    st_no_q_min = st_no1;
                    st_no_q_max = st_no2;
                  }
                  else
                  {
                    // 取st_no
                    v_st_no_chg = st_no1;
                    st_no_q_min = st_no2;
                    st_no_q_max = st_no1;
                  }
                }
                else if (0 < strcmp(v_hardness_group1, v_hardness_group2)) // 本炉硬度大于混浇相邻炉次
                {
                  // 取硬度较大者
                  v_hardness_group_chg = v_hardness_group1;
                  v_st_no_chg = st_no1; // 计划改钢出钢记号
                  st_no_q_min = st_no2; // 后考虑改钢出钢记号
                  st_no_q_max = st_no1; // 最优先改钢出钢记号
                }
                else // 本炉硬度小于混浇相邻炉次
                {
                  // 取st_no
                  v_hardness_group_chg = v_hardness_group2;
                  v_st_no_chg = st_no2;
                  st_no_q_min = st_no1;
                  st_no_q_max = st_no2;
                }
              }
              if (0 == strcmp(v_st_no_chg, st_no2))
              {
                elm_c = elm_c2;
                elm_p = elm_p2;
                elm_Cu = elm_Cu2;
                elm_Mn = elm_Mn2;
                elm_CEQ = elm_CEQ2;
              }
            } // end-----------选择出钢记号---------------
          }
          else
          {
            v_st_no_chg = "YY000030";
            slab_yy_flag = 3;
            v_hardness_group_chg = "A3";
            Y17_new_slab_direction = "G1";
            Log::Trace("", "", "没有查询到记录,v_st_no_chg = [{0}],v_hardness_group_chg=[{0}]", v_st_no_chg, v_hardness_group_chg);
          }
        }
      }
      else // 非混浇改钢，不考虑前后炉
      {
        if (0 == strcmp(st_no1, " "))
        {
          v_st_no_chg = "YY000030";    // 数据不全
          slab_yy_flag = 3;            // 没有找到对应的混浇出钢记号
          v_hardness_group_chg = "A3"; // 用于查找静态表使用，表示特殊值
          Y17_new_slab_direction = "G1";
          Log::Trace("", "", "炉次数据不全,v_st_no_chg = [{0}],v_hardness_group_chg=[{0}]", v_st_no_chg, v_hardness_group_chg);
        }
        else if (1 > v_elm_flag)
        {
          v_st_no_chg = "YY000030"; // 成份数据不全
          v_hardness_group_chg = "A3";
          Y17_new_slab_direction = "G1";
          slab_yy_flag = 3;
          Log::Trace("", "", "改钢出钢记号成份数据不全,v_st_no_chg = [{0}],v_hardness_group_chg=[{0}]", v_st_no_chg, v_hardness_group_chg);
        }
        else
        {
          v_st_no_chg = st_no1;
          v_hardness_group_chg = v_hardness_group1;
          st_no2 = " "; // 非混浇坯不需要考虑前后炉次的出钢记号
          Log::Trace("", "", " 非混浇改钢，只考虑单块板坯");
        }
      }

      // 对选定的出钢记号及硬度进行改钢选择
      Log::Trace("", "", "---------针对出钢记号 = [{0}] 的改钢处理---------", v_st_no_chg);
      // 根据特殊元素进行特例改钢
      if (elm_c <= 0.008)
      {
        if (elm_p >= 0.035) // zhenglei：新增加P的判定
        {
          v_st_no_chg = "GG000040";    // 高P超低C钢处理
          v_hardness_group_chg = "A4"; // 高P超低C钢处理
          // strcpy(Y17_new_slab_direction,"G2");
        }
        else
        {
          v_st_no_chg = "GG000010";    // 超低C钢处理
          v_hardness_group_chg = "A1"; // 超低C钢处理
          // strcpy(Y17_new_slab_direction,"G2");
        }
      }
      else if (elm_p >= 0.05 && elm_Cu >= 0.01)
      {
        v_st_no_chg = "GG000020";    // 高P高Cu钢处理
        v_hardness_group_chg = "A2"; // 高P高Cu钢处理
        // strcpy(Y17_new_slab_direction,"G2");
      }
      else if (elm_Mn >= 0.4 && 0 == strcmp(v_mat_destion, "00") && 0 == strcmp(v_hardness_group_chg, "01"))
        v_hardness_group_chg = "02"; // 根据贺应广的要求，对硬度等级是01的钢种，如果Mn超过0.4则不能判GR3180F2，需改判为GR4180F2
      else if (elm_CEQ > 0.21 && 0 == strcmp(v_mat_destion, "00") && 0 == strcmp(v_hardness_group_chg, "02"))
        v_mat_destion = "01"; // 根据贺应广的要求，对硬度等级是02的钢种，如果碳当量＞0.21则不能GR4180F2

      find_flag = 20; //"1"的优先级最高
      counter_for = 0;
      Log::Trace("", "", "---读静态表参数:出钢记号[{0}] 硬度组[{1}] 板坯位置[{2}] 板坯去向[{3}] 改钢路径Y17[{4}]---",
                 v_st_no_chg, v_hardness_group_chg, ptmmsm01["SLAB_PLACE_CODE"], v_mat_destion, Y17_new_slab_direction);

      for (size_t i = 0; i < tqmts9ce_q.Tables[0].Rows.get_Count(); i++)
      {
        tqmts9ce.MergeFrom(tqmts9ce_q.Tables[0].Rows[i]);
        counter_for++;
        if (0 == strcmp("YY000010", tqmts9ce["ST_NO"]) && 0 == strcmp("Y1", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]) && slab_yy_flag_1 == 1)
        {
          // 判断1 - Y1 + YY000010 + G1（炉次YY）
          find_flag = 1; //"1"的优先级最高
          Log::Trace("", "", "改钢处理1：本炉YY炉次");
          tqmts9ce_tmp.CopyFrom(tqmts9ce);
          break;
        }
        else if (0 == strcmp("YY000020", tqmts9ce["ST_NO"]) && 0 == strcmp("Y2", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]) && slab_yy_flag_2 == 1)
        {
          // 判断2 - Y2 + YY000020 + G1
          if (find_flag > 2)
          {
            find_flag = 2;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理2：相邻炉YY炉次");
          }
        }
        else if (0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp(st_no2, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断3 - 相邻出钢记号 + 本炉出钢记号 + 改钢路径(混浇)
          if (find_flag > 3)
          {
            find_flag = 3;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理3：相邻出钢记号 + 本炉出钢记号 + 改钢路径(混浇)");
          }
        }
        else if (0 == strcmp(v_st_no_chg, tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(ptmmsm01["SLAB_PLACE_CODE"], tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断4 - 选择出钢记号 + 硬度组 + 位置代码 + 改钢路径
          if (find_flag > 4)
          {
            find_flag = 4;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理4：选择出钢记号 + 硬度组 + 位置代码 + 改钢路径");
          }
        }
        else if (0 == strcmp(v_st_no_chg, tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断5 - 选择出钢记号 + 硬度组 + 改钢路径
          if (find_flag > 5)
          {
            find_flag = 5;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理5：选择出钢记号 + 硬度组 + 改钢路径");
          }
        }
        else if (0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(ptmmsm01["SLAB_PLACE_CODE"], tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断6 - 本炉出钢记号 + 板坯位置 + 改钢路径
          if (find_flag > 6)
          {
            find_flag = 6;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理6：本炉出钢记号 + 板坯位置 + 改钢路径");
          }
        }
        else if (0 == strcmp(st_no1, tqmts9ce["ST_NO"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断7 - 本炉出钢记号 + 改钢路径
          if (find_flag > 7)
          {
            find_flag = 7;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理7：本炉出钢记号 + 改钢路径");
          }
        }
        else if (0 == strcmp(v_st_no_chg, tqmts9ce["ST_NO"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断8 - 选择出钢记号 + 改钢路径
          if (find_flag > 8)
          {
            find_flag = 8;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理8：选择出钢记号 + 改钢路径");
          }
        }
        else if (0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(v_mat_destion, tqmts9ce["SLAB_DIRECTION"]) && 0 == strcmp(ptmmsm01["SLAB_PLACE_CODE"], tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断9 - 硬度组 + 位置代码 + 改钢路径 + 去向
          if (find_flag > 9)
          {
            find_flag = 9; //"1"的优先级最高
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理9：硬度组 + 位置代码 + 改钢路径 + 去向");
          }
        }
        else if (0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp(v_mat_destion, tqmts9ce["SLAB_DIRECTION"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断10 - 硬度组 + 改钢路径 + 去向
          if (find_flag > 10)
          {
            find_flag = 10;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理10：硬度组 + 改钢路径 + 去向");
          }
        }
        else if (0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DIRECTION"]) && 0 == strcmp(ptmmsm01["SLAB_PLACE_CODE"], tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断11 - 硬度组 + 位置代码 + 改钢路径
          if (find_flag > 11)
          {
            find_flag = 11; //"1"的优先级最高
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理11：硬度组 + 位置代码 + 改钢路径");
          }
        }
        else if (0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DIRECTION"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp(Y17_new_slab_direction, tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断12 - 硬度组 + 改钢路径
          if (find_flag > 12)
          {
            find_flag = 12;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理12：硬度组 + 改钢路径");
          }
        }
        else if (0 == strcmp("XX", tqmts9ce["ST_NO"]) && 0 == strcmp(v_hardness_group_chg, tqmts9ce["SLAB_DEAL_FLAG"]) && 0 == strcmp("XX", tqmts9ce["SLAB_DIRECTION"]) && 0 == strcmp("X", tqmts9ce["MAT_POSITION"]) && 0 == strcmp("XX", tqmts9ce["ASS_DIF_CODE"]))
        {
          // 判断11 - 硬度组
          if (find_flag > 13)
          {
            find_flag = 13;
            tqmts9ce_tmp.CopyFrom(tqmts9ce);
            Log::Trace("", "", "改钢处理13：硬度组");
          }
        }
        else
          continue;
      }

      // if (find_flag > 1 && find_flag < 20)

      if (find_flag != 20)
      {
        // 数据处理
        Log::Trace("", "", "匹配标记find_flag = [{0}]", find_flag);
        if (0 == strcmp(tqmts9ce_tmp["NEW_ST_NO"], st_no1) && 0 != strcmp(st_no2, " "))
        {
          tqmts9ce_tmp["NEW_ST_NO"] = st_no2;
          Log::Trace("", "", "改钢目标出钢记号与板坯出钢记号相同则认为需要更改为与之混浇的出钢记号");
        }
        Log::Trace("", "", "---读取静态表tqmts9ce_tmp方式号[%d]---", tqmts9ce_tmp["PATTERN_NO"]);
        f_qmbs_data_proc(ptmmsm01, tqmts9ce_tmp, bcls_ret);
        Log::Trace("", "", "最终出钢记号 = [%s]", ptmmsm01["FIN_ST_NO"]);

        // if (0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "1") && 0 == strcmp(ptmmsm01["PREC_SLAB_NO"], " "))
        //{
        //	if ((0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR3160F1") || 0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR3160F4")
        //		|| 0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR4160F4") || 0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR4160F1")
        //		|| 0 == strcmp(ptmmsm01["FIN_ST_NO"], "AP1860C1")) && 0 != strcmp(tqmts9ce_tmp["CHG_ST_NO_TYPE"], "4"))
        //	{
        //		if ((ptmmsm01["MAT_ACT_LEN"].ToDecimal() >= 7000 && ptmmsm01["MAT_ACT_LEN"].ToDecimal() <= 8500)
        //			&& ((ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() >= 1010 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() <= 1100) || (ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() >= 1240 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() <= 1300)))
        //		{
        //			if (0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR3160F1") || 0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR3160F4") || 0 == strcmp(ptmmsm01["FIN_ST_NO"], "AP1860C1"))
        //			{
        //				ptmmsm01["FIN_ST_NO"] = "GR3180F2";
        //			}
        //			else if (0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR4160F1") || 0 == strcmp(ptmmsm01["FIN_ST_NO"], "GR4160F4"))
        //			{
        //				ptmmsm01["FIN_ST_NO"] = "GR4180F2";
        //			}
        //			ptmmsm01["ST_NO"] = ptmmsm01["FIN_ST_NO"];
        //			ptmmsm01["MAT_DESTION"] = "00";
        //		}
        //	}
        //	else if (0 == strcmp(ptmmsm01["ST_NO"], "GR3180F2") || 0 == strcmp(ptmmsm01["ST_NO"], "GR4180F2"))
        //	{
        //		if (ptmmsm01["MAT_ACT_LEN"].ToDecimal() < 7000 || ptmmsm01["MAT_ACT_LEN"].ToDecimal() > 8500 || ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() < 1010
        //			|| ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() > 1300 || (ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() < 1240 && ptmmsm01["MAT_ACT_WIDTH"].ToDecimal() > 1100))
        //		{
        //			if (0 == strcmp(ptmmsm01["ST_NO"], "GR3180F2"))
        //			{
        //				ptmmsm01["FIN_ST_NO"] = "GR3160F1";
        //			}
        //			else if (0 == strcmp(ptmmsm01["ST_NO"], "GR4180F2"))
        //			{
        //				ptmmsm01["FIN_ST_NO"] = "GR4160F1";
        //			}
        //			ptmmsm01["ST_NO"] = ptmmsm01["FIN_ST_NO"];
        //			ptmmsm01["MAT_DESTION"] = "01";
        //			if (0 == strcmp(ptmmsm01["CHG_ST_NO_TYPE"], " "))
        //				ptmmsm01["CHG_ST_NO_TYPE"] = "9";
        //		}
        //	}
        // }
      }
      else
      {

        ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+改钢模型计算错误，人工处置!";
        ptmmsm01["SURFACE_DECIDE_CODE"] = "4";
        Log::Trace("", "", "静态表中没有读取到满足改钢条件的记录！counter_for = [{0}]", counter_for);
        doFlag = 0;
        // 2023.6.17
        // throw CApplicationException(-1, s.msg, log.Location);
      }
    }
    else // 静态表配置错误，改钢路径为空值
    {

      ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+改钢模型错误2，人工处置!";
      ptmmsm01["SURFACE_DECIDE_CODE"] = "4";
      Log::Trace("", "", "无改钢路径!,new_slab_direction=[{0}]", tqmts9ce_tmp["NEW_SLAB_DIRECTION"]);
      doFlag = 0;
      // 2023.6.17
      // throw CApplicationException(-1, s.msg, log.Location);
    }

    // -----Begin IPLAT4C::IPLAT4CServiceCompositeStatementObj()----- //
    // -----End IPLAT4C::IPLAT4CServiceCompositeStatementObj()----- //
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
