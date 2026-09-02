/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
******************************************************************************
*  程序名称   : f_mmsm01_data_proc
*  程序描述   : 板坯自动判定处理_数据处理
*  备注说明   :
*  创建日期   : 2014-04-09 weichenxiang
*  修改历史   : 2017-11-01 (完善、优化处理程序)
*             : 2022-06-18 zhenglei
*               通过质量等级来实现不同控制要求，增加强制热送的处理
*               质量控制等级拆分为两部分：
*                 第一部分：清理控制等级；（第1位：处置等级，第2位：清理方法等级）
*                 第二部分：改钢控制等级；
*                 数值高的等级优先
*             : 2022-10-17 zhenglei：优化质量等级处置
*             : 2023-05-18 panchen: 代码转最新框架
******************************************************************************/
/***** C/C++ 的标准头文件部分 *****/
#include "stdafx.h"

BM2_FUNCTION_EXPORT

int f_qmbs_data_proc(CModel &ptmmsm01, CModel &ptqmts9ce, EIClass *bcls_ret)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  int ret = 0;
  char msg[100] = " ";
  int blkNum = 0;
  int find_flag = 0;
  CString v_slab_dhcr_code = "0";     // 从工艺卡获得的热送基准
  CString v_clean_grade_old = "0";    // 清理要求（tmmsm01）
  CString v_chg_stno_grade_old = "0"; // 改钢要求（tmmsm01）
  CString v_tmmsm01_grade = "00";     // TMMSM01表中的质量控制等级
  try
  {

    //----------------------- 数据预处理 -------------------------//
    Log::Trace("", "", "处理方式号PATTERN_NO[{0}]", ptqmts9ce["PATTERN_NO"]);
    // 垛位推荐原因默认为80
    if (ptqmts9ce["SLAT_UNLADE_CAUSE"].ToString() == " ")
      ptqmts9ce["SLAT_UNLADE_CAUSE"] = "80"; // 默认为80，合格下线

    // 对tmmsm01表质量处置等级进行默认值处理
    if (ptmmsm01["CHG_ST_NO_GRADE"].ToString() == " " || 2 != ptmmsm01["CHG_ST_NO_GRADE"].ToString().GetLength())
    {
      ptmmsm01["CHG_ST_NO_GRADE"] = "00"; // 质量处置等级默认为00。
    }
    // 对tqmts9ce表清理等级进行默认值处理
    if (ptqmts9ce["CLEAN_SLAB_GRADE"].ToString() == " " || 1 != ptqmts9ce["CLEAN_SLAB_GRADE"].ToString().GetLength())
    {
      ptqmts9ce["CLEAN_SLAB_GRADE"] = "X"; // 清理等级默认为X。
    }
    // 对tqmts9ce改钢等级进行默认值处理
    if (ptqmts9ce["CHG_ST_NO_GRADE"].ToString() == " " || 1 != ptqmts9ce["CHG_ST_NO_GRADE"].ToString().GetLength())
    {
      ptqmts9ce["CHG_ST_NO_GRADE"] = "0"; // 改钢等级默认为0。
    }

    v_tmmsm01_grade = ptmmsm01["CHG_ST_NO_GRADE"].ToString(); // 质量处置临时存储

    // EDLog(1, 1, "TMMSM01中质量等级= [%s]，TPSM9P中清理等级= [%s],TPSM9P中改钢等级= [%s]", v_tmmsm01_grade, ptqmts9ce["CLEAN_SLAB_GRADE"], ptqmts9ce["CHG_ST_NO_GRADE"]);
    Log::Trace("", "", "TMMSM01中质量等级= {0}", v_tmmsm01_grade);
    Log::Trace("", "", "TPSM9P中清理等级= {0}", ptqmts9ce["CLEAN_SLAB_GRADE"]);
    Log::Trace("", "", "TPSM9P中改钢等级= {0}", ptqmts9ce["CHG_ST_NO_GRADE"]);

    /*------------将质量等级拆分------------*/
    // TMMSM01的CHG_ST_NO_GRADE拆分
    // 第1位：清理等级
    v_clean_grade_old = ptmmsm01["CHG_ST_NO_GRADE"].ToString().GetAt(0);
    // 第2为改钢等级
    v_chg_stno_grade_old = ptmmsm01["CHG_ST_NO_GRADE"].ToString().GetAt(1);
    /*------------将质量等级拆分end------------*/

    // 清理要求处置
    if ("X" == ptqmts9ce["CLEAN_SLAB_GRADE"].ToString())
    {

      EDLog(1, 1, "清理等级有特殊要求,质量判定自由竞争!");
    }
    else if (v_clean_grade_old < ptqmts9ce["CLEAN_SLAB_GRADE"].ToString()) // 新的处置要求中清理要求高于原处置实绩,则按照新的处理，原来的处置要求重置为合格
    {

      EDLog(1, 1, "新的处置要求中清理要求高于原处置实绩!");
      Log::Trace("", "", "line {0}", __LINE__);
      if (0 == strcmp(ptqmts9ce["SURFACE_DECIDE_CODE"], "1") || 0 == strcmp(ptqmts9ce["SURFACE_DECIDE_CODE"], "4")) // 只有这有明确质量判定要求时才进行处置
      {
        Log::Trace("", "", "line {0}", __LINE__);
        v_clean_grade_old = ptqmts9ce["CLEAN_SLAB_GRADE"];
        // 如果新的处置中没有清理需求则将原来的清理方法清空，否则取要求最高的一种清理方法
        if (0 != strcmp(ptqmts9ce["HAND_FLAG"], "7") && 0 != strcmp(ptqmts9ce["HAND_FLAG"], "4") && 0 != strcmp(ptqmts9ce["HAND_FLAG"], "0") && 0 != strcmp(ptqmts9ce["HAND_FLAG"], " "))
        {
          ptmmsm01["PLAN_CLEAN_FLAG"] = " "; // 计划清理标记为空
          ptmmsm01["HDSCARF_MODE"] = " ";    // 计划清理方法为空
        }
        if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "7")) // 原来处置代码为精整后清理
        {
          ptmmsm01["FINISH_FLAG"] = "3"; // 处置代码为3：需精整
        }
        else if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "4")) // 原来处置代码为清理，则可以直接判定为合格
        {
          ptmmsm01["FINISH_FLAG"] = " ";         // 处置代码
          ptmmsm01["SURFACE_DECIDE_CODE"] = "1"; // 表面判定合格
          ptmmsm01["HOLD_FLAG"] = "0";           // 质量判定
          ptmmsm01["HOLD_CAUSE_CODE"] = " ";     // 封锁原因
          strcmp(ptmmsm01["CLEAN_POS"], " ");    // 处置位置
          ptmmsm01["STOCK_PLACE_NO_TO"] = "9";   // 垛位推荐
          ptmmsm01["SLAT_UNLADE_CAUSE"] = "80";  // 默认为80，合格下线
        }
      }
      else
      {
        Log::Trace("", "", "质量判定为空，不更改原板坯清理控制要求[{0}]", ptqmts9ce["SURFACE_DECIDE_CODE"]);
      }
    }
    else if (0 < strcmp(v_clean_grade_old, ptqmts9ce["CLEAN_SLAB_GRADE"])) // 新的处置中清理要求低于原处置实绩，则对新的要求进行重置为合格
    {

      EDLog(1, 1, "新的处置要求中清理要求低于原处置实绩");
      if (0 != strcmp(ptmmsm01["FINISH_FLAG"], "7") && 0 != strcmp(ptmmsm01["FINISH_FLAG"], "4") && 0 != strcmp(ptmmsm01["FINISH_FLAG"], "0") && 0 != strcmp(ptmmsm01["FINISH_FLAG"], " "))
      {
        ptqmts9ce["CLEACN_WAY_FLAG"] = " "; // 清理标记
        ptqmts9ce["CLEACN_WAY_CODE"] = " "; // 清理方法
      }
      if (0 == strcmp(ptqmts9ce["HAND_FLAG"], "4")) // 对计划处置要求为需清理的板坯按照合格来处理
      {
        ptqmts9ce["HAND_FLAG"] = " ";           // 处置代码
        ptqmts9ce["SURFACE_DECIDE_CODE"] = "1"; // 表面判定合格
        ptmmsm01["HOLD_FLAG"] = "0";            // 质量判定
        ptqmts9ce["HOLD_CAUSE_CODE"] = " ";     // 封锁原因
        strcmp(ptqmts9ce["DEAL_PLACE"], " ");   // 处置位置
        ptqmts9ce["PILE_RECOM"] = "9";          // 垛位推荐
        ptqmts9ce["SLAT_UNLADE_CAUSE"] = "80";  // 默认为80，合格下线
      }
      else if (0 == strcmp(ptqmts9ce["HAND_FLAG"], "7")) // 对计划处置要求为精整后清理更改为需精整
      {
        ptqmts9ce["HAND_FLAG"] = "3"; // 处置方式
      }
    }

    // 改钢要求处置
    if (0 > strcmp(v_chg_stno_grade_old, ptqmts9ce["CHG_ST_NO_GRADE"])) // 新的处置要求中改钢要求高于原处置实绩,则按照新的处理，原来的处置要求重置
    {
      EDLog(1, 1, "新的处置要求中改钢要求高于板坯实绩");
      v_chg_stno_grade_old = ptqmts9ce["CHG_ST_NO_GRADE"];
      // strcpy(ptmmsm01["PCH_JUDGE_CODE"],"0");//原板坯的性能封锁代码置0
      if (0 != strcmp(ptqmts9ce["NEW_ST_NO"], " ") && 8 == strlen(ptqmts9ce["NEW_ST_NO"])) // 如果新的处置中有改钢出钢记号，则清除原出钢记号，采用新出钢记号
      {
        ptmmsm01["FIN_ST_NO"] = " ";      // 出钢记号
        ptmmsm01["CHG_ST_NO_TYPE"] = " "; // 改钢原因
        ptmmsm01["CHG_ST_NO_FLAG"] = " "; // 改钢标记
      }
    }
    else if (0 < strcmp(v_chg_stno_grade_old, ptqmts9ce["CHG_ST_NO_GRADE"])) // 新的处置中改钢要求低于原处置实绩，则对新的要求进行处理
    {
      EDLog(1, 1, "新的处置要求中改钢要求低于板坯实绩");
      ptqmts9ce["BACKUP_1"] = "0";                                                       // 新的性能封锁代码置0
      if (0 != strcmp(ptmmsm01["FIN_ST_NO"], " ") && 8 == strlen(ptmmsm01["FIN_ST_NO"])) // 如果板坯实绩中有改钢出钢记号，则清处置表中的出钢记号，采用原板坯出钢记号
      {
        ptqmts9ce["NEW_ST_NO"] = " ";      // 新出钢记号
        ptqmts9ce["CHG_ST_NO_TYPE"] = " "; // 改钢原因
        ptqmts9ce["CHG_ST_NO_FLAG"] = " "; // 改钢标记
      }
    }

    ptmmsm01["CHG_ST_NO_GRADE"] = v_clean_grade_old;                                             // 清理等级更新
    ptmmsm01["CHG_ST_NO_GRADE"] = ptmmsm01["CHG_ST_NO_GRADE"].ToString() + v_chg_stno_grade_old; // 改钢等级更新

    if (0 == strcmp(ptmmsm01["CHG_ST_NO_GRADE"], " ") || 2 != strlen(ptmmsm01["CHG_ST_NO_GRADE"]))
    {
      ptmmsm01["CHG_ST_NO_GRADE"] = "00"; // 质量处置等级默认为00。
    }
    Log::Trace("", "", "当前更新后的板坯的质量处置等级[{0}]", ptmmsm01["CHG_ST_NO_GRADE"]);

    //--------------------end 数据预处理-------------------------//
    EDLog(1, 1, "数据处理开始!");
    // X1-处理标记
    Log::Trace("", "", "ptmmsm01[FINISH_FLAG] {0}", ptmmsm01["FINISH_FLAG"]);
    Log::Trace("", "", "ptqmts9ce[HAND_FLAG] {0}", ptqmts9ce["HAND_FLAG"]);
    if (0 == strcmp(ptmmsm01["FINISH_FLAG"], ptqmts9ce["HAND_FLAG"]))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      EDLog(1, 1, "新的处置与原处置要求相同!");
    }
    else if (7 <= (atoi(ptmmsm01["FINISH_FLAG"]) + atoi(ptqmts9ce["HAND_FLAG"])))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["FINISH_FLAG"] = "7";
    }
    else if (0 > strcmp(ptmmsm01["FINISH_FLAG"], ptqmts9ce["HAND_FLAG"]))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["FINISH_FLAG"] = ptqmts9ce["HAND_FLAG"];
    }
    Log::Trace("", "", "ptmmsm01[FINISH_MODE] = {0}", ptmmsm01["FINISH_MODE"]);
    Log::Trace("", "", "ptqmts9ce[FINISH_WAY] = {0}", ptqmts9ce["FINISH_WAY"]);
    Log::Trace("", "", "compare = {0}", strcmp(ptmmsm01["FINISH_MODE"], ptqmts9ce["FINISH_WAY"]));
    // X2-精整方法
    if (0 > strcmp(ptmmsm01["FINISH_MODE"], ptqmts9ce["FINISH_WAY"]) && 0 != strcmp(ptqmts9ce["FINISH_WAY"], " "))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["FINISH_MODE"] = ptqmts9ce["FINISH_WAY"];
    }

    // X3-清理标记
    if (0 > strcmp(ptmmsm01["PLAN_CLEAN_FLAG"], ptqmts9ce["CLEACN_WAY_FLAG"]) && 0 != strcmp(ptqmts9ce["CLEACN_WAY_FLAG"], " "))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["PLAN_CLEAN_FLAG"] = ptqmts9ce["CLEACN_WAY_FLAG"];
    }

    // X4-清理方法
    if (0 > strcmp(ptmmsm01["HDSCARF_MODE"], ptqmts9ce["CLEACN_WAY_CODE"]) && 0 != strcmp(ptqmts9ce["CLEACN_WAY_CODE"], " "))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["HDSCARF_MODE"] = ptqmts9ce["CLEACN_WAY_CODE"];
    }

    // X5-改钢标记
    if (0 > strcmp(ptmmsm01["CHG_ST_NO_FLAG"], ptqmts9ce["CHG_ST_NO_FLAG"]) && 0 != strcmp(ptqmts9ce["CHG_ST_NO_FLAG"], " "))
    {
      Log::Trace("", "", "line {0}", __LINE__);
      ptmmsm01["CHG_ST_NO_FLAG"] = ptqmts9ce["CHG_ST_NO_FLAG"];
    }

    // X6-封锁原因
    if (0 > strcmp(ptmmsm01["HOLD_CAUSE_CODE"], ptqmts9ce["HOLD_CAUSE_CODE"]) && 0 != strcmp(ptqmts9ce["HOLD_CAUSE_CODE"], " "))
    {
      ptmmsm01["HOLD_CAUSE_CODE"] = ptqmts9ce["HOLD_CAUSE_CODE"];
      Log::Trace("", "", "HOLD_CAUSE_CODE[{0}]", ptmmsm01["HOLD_CAUSE_CODE"].ToString());
    }

    // X7-封锁注释
    ptqmts9ce["HOLD_CAUSE_REMARK"] = ptqmts9ce["HOLD_CAUSE_REMARK"].ToString().Trim();
    if (ptqmts9ce["HOLD_CAUSE_REMARK"].ToString().Trim() != "" && ptmmsm01["HOLD_REMARK"] != ptqmts9ce["HOLD_CAUSE_REMARK"])
    {
      ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString().Trim();
      if (ptmmsm01["HOLD_REMARK"].ToString().Trim() != "")
      {
        ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + "+";
      }
      ptmmsm01["HOLD_REMARK"] = ptmmsm01["HOLD_REMARK"].ToString() + ptqmts9ce["HOLD_CAUSE_REMARK"].ToString();
    }

    // X8-缺陷代码
    ptqmts9ce["DEFECT_CODE_F_1"] = ptqmts9ce["DEFECT_CODE_F_1"].ToString().Trim();
    if (0 != strcmp(ptqmts9ce["DEFECT_CODE_F_1"], ""))
    {
      if (' ' == ptmmsm01["DEFECT_CODE_F_1"].ToString().GetAt(0))
      {
        ptmmsm01["DEFECT_CODE_F_1"] = ptqmts9ce["DEFECT_CODE_F_1"];
      }
      else if (' ' == ptmmsm01["DEFECT_CODE_F_2"].ToString().GetAt(0))
      {
        ptmmsm01["DEFECT_CODE_F_2"] = ptqmts9ce["DEFECT_CODE_F_1"];
      }
      else if (' ' == ptmmsm01["DEFECT_CODE_F_3"].ToString().GetAt(0))
      {
        ptmmsm01["DEFECT_CODE_F_3"] = ptqmts9ce["DEFECT_CODE_F_1"];
      }
      else if (' ' == ptmmsm01["DEFECT_CODE_F_4"].ToString().GetAt(0))
      {
        ptmmsm01["DEFECT_CODE_F_4"] = ptqmts9ce["DEFECT_CODE_F_1"];
      }
      else
      {
        Log::Trace("", "", "缺陷代码超出4个,不做记录[{0}]", ptqmts9ce["DEFECT_CODE_F_1"]);
      }
    }

    // X9-表面判定
    if (0 > strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], ptqmts9ce["SURFACE_DECIDE_CODE"]) && 0 != strcmp(ptqmts9ce["SURFACE_DECIDE_CODE"], " "))
    {
      ptmmsm01["SURFACE_DECIDE_CODE"] = ptqmts9ce["SURFACE_DECIDE_CODE"];
    }

    // X10-处理位置
    if (0 == strcmp(ptmmsm01["CLEAN_POS"], " ") && 0 != strcmp(ptqmts9ce["DEAL_PLACE"], " "))
    {
      ptmmsm01["CLEAN_POS"] = ptqmts9ce["DEAL_PLACE"];
    }
    else if (ptqmts9ce["DEAL_PLACE"].ToString().Trim() != "")
    {
      CString defect_code = ptmmsm01["CLEAN_POS"];
      ptmmsm01["CLEAN_POS"] = "";
      // for (int i = 0; i < 4; i++)
      //{
      //	if ('\0' == ptqmts9ce["DEAL_PLACE"].ToString().GetAt(i)) break;
      //	ptmmsm01["CLEAN_POS"] = ptmmsm01["CLEAN_POS"] + (ptmmsm01["CLEAN_POS"].ToString().GetAt[i] == "1" ? "1" : ptqmts9ce["DEAL_PLACE"].ToString().GetAt[i] == "1" ? "1" : "0");
      // }
      // 如果defect_code.GetAt[i] 为1，就不变，如果不为1，则看ptqmts9ce["DEAL_PLACE"].ToString().GetAt(i),如果为1，赋值1，否则赋值0
      for (size_t i = 0; i < ptqmts9ce["DEAL_PLACE"].ToString().GetLength(); i++)
      {
        if (defect_code.SubstringNE(i, 0) == "1")
        {
          ptmmsm01["CLEAN_POS"] = ptmmsm01["CLEAN_POS"].ToString() + "1";
        }
        else if (ptqmts9ce["DEAL_PLACE"].ToString().GetAt(i) == (CString) "1")
        {
          ptmmsm01["CLEAN_POS"] = ptmmsm01["CLEAN_POS"].ToString() + "1";
        }
        else
        {
          ptmmsm01["CLEAN_POS"] = ptmmsm01["CLEAN_POS"].ToString() + "0";
        }
      }
    }

    // X11-跺位推荐:选择两原因小的为主
    if (0 != strcmp(ptqmts9ce["PILE_RECOM"], " ") && 0 < strcmp(ptmmsm01["STOCK_PLACE_NO_TO"], ptqmts9ce["PILE_RECOM"]))
    {
      ptmmsm01["STOCK_PLACE_NO_TO"] = ptqmts9ce["PILE_RECOM"];
    }

    // X12-S样封锁
    if (0 > strcmp(ptmmsm01["PCH_JUDGE_CODE"], ptqmts9ce["BACKUP_1"]) && 0 != strcmp(ptqmts9ce["BACKUP_1"], " "))
    {
      ptmmsm01["PCH_JUDGE_CODE"] = ptqmts9ce["BACKUP_1"];
      // EDLog(1, 1, "低倍封锁坯子");
    }

    // X13-取样指示
    if (0 != strcmp(" ", ptqmts9ce["BACKUP_2"]))
    {
      if (0 == strcmp(" ", ptmmsm01["SLAB_SAMPLE_REQ"]))
      {
        ptmmsm01["SLAB_SAMPLE_REQ"] = ptqmts9ce["BACKUP_2"];
      }
      else if (0 == strcmp("1", ptmmsm01["SLAB_SAMPLE_REQ"]) || 0 == strcmp("4", ptmmsm01["SLAB_SAMPLE_REQ"]))
      {
        if (0 == strcmp("2", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("3", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("10", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("11", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("6", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "11";
        }
        else if (0 == strcmp("5", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "5";
        }
        else if (0 == strcmp("4", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "4";
        }
      }
      else if (0 == strcmp("2", ptmmsm01["SLAB_SAMPLE_REQ"]) || 0 == strcmp("3", ptmmsm01["SLAB_SAMPLE_REQ"]) || 0 == strcmp("6", ptmmsm01["SLAB_SAMPLE_REQ"]) || 0 == strcmp("10", ptmmsm01["SLAB_SAMPLE_REQ"]))
      {
        if (0 == strcmp("1", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("4", ptqmts9ce["BACKUP_2"]) || 0 == strcmp("11", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "11";
        }
        else if (0 == strcmp("5", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "5";
        }
        else
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = "2";
        }
      }
      else if (0 == strcmp("11", ptmmsm01["SLAB_SAMPLE_REQ"]))
      {
        if (0 == strcmp("5", ptqmts9ce["BACKUP_2"]))
        {
          ptmmsm01["SLAB_SAMPLE_REQ"] = ptqmts9ce["BACKUP_2"];
        }
      }
    }

    // X14出钢记号(改钢)
    // if(0 == strcmp(ptmmsm01["FIN_ST_NO"], " ") && 0 != strcmp(ptqmts9ce["NEW_ST_NO"], " "))
    if (0 != strcmp(ptqmts9ce["NEW_ST_NO"], " ") && 8 == strlen(ptqmts9ce["NEW_ST_NO"]))
    {
      ptmmsm01["FIN_ST_NO"] = ptqmts9ce["NEW_ST_NO"];
      // 覆盖出钢记号之前判断最终出钢记号是否改钢，改钢则修改热装标记为"0"。
      // if (0 != strcmp(ptmmsm01["ST_NO"], ptqmts9ce["NEW_ST_NO"]))
      //{
      //	ptmmsm01["HOT_CHARGE_FLAG"] = "0";//改钢后取消热装
      //	ptmmsm01["PREC_SLAB_NO"] = " ";//预定板坯号置空
      //	ptmmsm01["NO_CAUSE"] = "8";//未赋号理由
      //	ptmmsm01["ORDER_NO"] = " ";//合同号
      // }
      // 高强钢有影响  暂时屏蔽
      // if (0 != strcmp(ptmmsm01["MAT_DESTION"], "00"))
      //{
      //	ptmmsm01["MAT_DESTION"] = "00";//改钢后不再维持外供去向
      // }
    }

    // X15改钢原因（更改出钢记号就需要有改钢原因）
    if (0 != strcmp(ptqmts9ce["CHG_ST_NO_TYPE"], " "))
    {
      ptmmsm01["CHG_ST_NO_TYPE"] = ptqmts9ce["CHG_ST_NO_TYPE"];
      ptmmsm01["PCH_JUDGE_CODE"] = "0"; // 板坯改钢后性能封锁代码置0
    }

    // X18板坯去向
    if (0 == strcmp(ptqmts9ce["NEW_SLAB_DIRECTION"], "01") || 0 == strcmp(ptqmts9ce["NEW_SLAB_DIRECTION"], "00"))
    {
      ptmmsm01["MAT_DESTION"] = ptqmts9ce["NEW_SLAB_DIRECTION"];
    }

    // X17下线原因
    if (0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "1"))
    {
      if (0 == strcmp(ptmmsm01["MAT_DESTION"], "01")) // 1热轧板坯
        ptmmsm01["SLAT_UNLADE_CAUSE"] = "71";
      else if (0 == strcmp(ptmmsm01["MAT_DESTION"], "00")) // 2热轧板坯
        ptmmsm01["SLAT_UNLADE_CAUSE"] = "80";
      else // 外供板坯
        ptmmsm01["SLAT_UNLADE_CAUSE"] = "73";
    }
    else if (0 != strcmp(ptqmts9ce["SLAT_UNLADE_CAUSE"], " ") && 0 > strcmp(ptqmts9ce["SLAT_UNLADE_CAUSE"], ptmmsm01["SLAT_UNLADE_CAUSE"]))
    {
      ptmmsm01["SLAT_UNLADE_CAUSE"] = ptqmts9ce["SLAT_UNLADE_CAUSE"];
    }

    /*
    //对封锁的强制热送（必须热送）钢种的清理计划进行处置
    if(0==strcmp(v_slab_dhcr_code,"1") && 0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "4"))//1 : 必热送，不允许下线，3 : 必热送下线需缓冷
    {
    if(0 == strcmp(ptmmsm01["FINISH_FLAG"], "7"))//对计划处置要求为精整后清理更改为需精整
    {
    ptmmsm01["FINISH_FLAG"] = "3";//处置代码为需精整
    ptmmsm01["PLAN_CLEAN_FLAG"] = "0";//计划清理标记为空
    ptmmsm01["HDSCARF_MODE"] = "0";//计划清理方法为空
    strcpy(ptmmsm01["PCH_JUDGE_CODE"],"0");//性能封锁代码为空
    }
    else if(0 == strcmp(ptmmsm01["FINISH_FLAG"], "4"))//需清理板坯都直接判定为合格
    {
    ptmmsm01["FINISH_FLAG"] =   "0";//处置代码为空
    ptmmsm01["PLAN_CLEAN_FLAG"] = "0";//计划清理标记为空
    ptmmsm01["HDSCARF_MODE"] = "0";//计划清理方法为空
    strcpy(ptmmsm01["PCH_JUDGE_CODE"],"0");//性能封锁代码为空
    strcpy(ptmmsm01["SURFACE_DECIDE_CODE"],"1");//表面判定合格
    ptmmsm01["HOLD_FLAG"] = "0";//质量判定为合格
    strcpy(ptmmsm01["HOLD_CAUSE_CODE"],"0");//封锁原因置0
    strcmp(ptmmsm01["CLEAN_POS"], "0000");//处理位置置0
    strcpy(ptmmsm01["STOCK_PLACE_NO_TO"]," ");//处跺位推荐置0
    }
    }
    */

    // 对结果进行处理，0代表空值，保存的时候直接赋空值
    EDLog(1, 1, "对结果进行处理，0代表空值，保存的时候直接赋空值!");
    if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "2") || 0 == strcmp(ptmmsm01["FINISH_FLAG"], "0") || 0 == strcmp(ptmmsm01["FINISH_FLAG"], " ") || 0 == strcmp(ptmmsm01["FINISH_FLAG"], "1"))
    {
      // 需摊检则清除清理方法及位置
      ptmmsm01["CLEAN_POS"] = " ";
      ptmmsm01["HDSCARF_MODE"] = " ";
      ptmmsm01["PLAN_CLEAN_FLAG"] = " ";
      ptmmsm01["PLAN_CLEAN_FLAG"] = " ";
    }
    else if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "3")) // 需精整则清除清理方法
    {
      ptmmsm01["HDSCARF_MODE"] = " ";
      ptmmsm01["PLAN_CLEAN_FLAG"] = " ";
    }
    else if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "4")) // 需清理则清除精整方法
    {
      ptmmsm01["FINISH_MODE"] = " ";
    }
    if (0 == strcmp(ptmmsm01["FINISH_FLAG"], "0"))
      ptmmsm01["FINISH_FLAG"] = " ";
    if (0 == strcmp(ptmmsm01["FINISH_MODE"], "0"))
      ptmmsm01["FINISH_MODE"] = " ";
    if (0 == strcmp(ptmmsm01["PLAN_CLEAN_FLAG"], "0"))
      ptmmsm01["PLAN_CLEAN_FLAG"] = " ";
    if (0 == strcmp(ptmmsm01["HDSCARF_MODE"], "0") && (0 == strcmp(ptmmsm01["PLAN_CLEAN_FLAG"], "0") || 0 == strcmp(ptmmsm01["PLAN_CLEAN_FLAG"], " ")))
      ptmmsm01["HDSCARF_MODE"] = " ";
    if (0 == strcmp(ptmmsm01["CHG_ST_NO_FLAG"], "0"))
      ptmmsm01["CHG_ST_NO_FLAG"] = " ";
    if (0 == strcmp(ptmmsm01["HOLD_CAUSE_CODE"], "0"))
      ptmmsm01["HOLD_CAUSE_CODE"] = " ";
    if (0 == strcmp(ptmmsm01["HOLD_REMARK"], "0"))
      ptmmsm01["HOLD_REMARK"] = " ";
    if (0 == strcmp(ptmmsm01["DEFECT_CODE_F_1"], "0"))
      ptmmsm01["DEFECT_CODE_F_1"] = " ";
    if (0 == strcmp(ptmmsm01["DEFECT_CODE_F_2"], "0"))
      ptmmsm01["DEFECT_CODE_F_2"] = " ";
    if (0 == strcmp(ptmmsm01["DEFECT_CODE_F_3"], "0"))
      ptmmsm01["DEFECT_CODE_F_3"] = " ";
    if (0 == strcmp(ptmmsm01["DEFECT_CODE_F_4"], "0"))
      ptmmsm01["DEFECT_CODE_F_4"] = " ";
    if (0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "0"))
      ptmmsm01["SURFACE_DECIDE_CODE"] = "1";
    if (0 == strcmp(ptmmsm01["CLEAN_POS"], "0000"))
      ptmmsm01["CLEAN_POS"] = " ";
    // if(0 == strcmp(ptmmsm01["STOCK_PLACE_NO_TO"], "0"))
    //	ptmmsm01["STOCK_PLACE_NO_TO"] = " ";
    if (0 == strcmp(ptmmsm01["PCH_JUDGE_CODE"], "0"))
      ptmmsm01["PCH_JUDGE_CODE"] = " ";
    if (0 == strcmp(ptmmsm01["SLAB_SAMPLE_REQ"], "0"))
      ptmmsm01["SLAB_SAMPLE_REQ"] = " ";
    if (0 == strcmp(ptmmsm01["FIN_ST_NO"], "0"))
      ptmmsm01["FIN_ST_NO"] = " ";
    if (0 == strcmp(ptmmsm01["CHG_ST_NO_TYPE"], "0"))
      ptmmsm01["CHG_ST_NO_TYPE"] = " ";
    // if(0 == strcmp(ptmmsm01["CHG_ST_NO_GRADE"], "00"))
    //	ptmmsm01["CHG_ST_NO_GRADE"] = " ";
    // 封锁标记处理
    if (0 == strcmp(ptmmsm01["SURFACE_DECIDE_CODE"], "1"))
    {
      ptmmsm01["HOLD_FLAG"] = "0";
    }
    else
    {
      ptmmsm01["HOLD_FLAG"] = "1";
    }
    // 合同号、用户代码处理
    if (0 == strcmp(ptmmsm01["PREC_SLAB_NO"], " "))
    {
      ptmmsm01["ORDER_NO"] = " ";      // 合同号
      ptmmsm01["FIN_CUST_CODE"] = " "; // 最终用户代码
    }
    else if (0 == strcmp(ptmmsm01["ORDER_NO"], " "))
    {
      ptmmsm01["FIN_CUST_CODE"] = " "; // 最终用户代码
    }
    // st_no的维护
    if (8 == strlen(ptmmsm01["FIN_ST_NO"]) && 0 != strcmp(ptmmsm01["FIN_ST_NO"], " "))
    {
      ptmmsm01["ST_NO"] = ptmmsm01["FIN_ST_NO"];
      // 有最终出钢记号则必须有改钢原因
      if (0 == strcmp(ptmmsm01["CHG_ST_NO_TYPE"], " ") && 0 != strcmp(ptmmsm01["FIN_ST_NO"], " "))
      {
        ptmmsm01["CHG_ST_NO_TYPE"] = "B";
      }
    }
    else
    {
      ptmmsm01["ST_NO"] = ptmmsm01["PREC_ST_NO"];
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
