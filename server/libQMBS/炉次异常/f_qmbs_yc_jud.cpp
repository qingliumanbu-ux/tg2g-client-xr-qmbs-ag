/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-06-13 19:54:28
Description: 炉次异常更新炉次质量表TQMTS23
**************************************************/

#include "stdafx.h"

BM2_FUNCTION_EXPORT

int f_qmbs_yc_jud(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  int ret;
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CModel tqmts23("TQMTS23"); // 炉次质量信息表
  CModel tqmbs71("TQMBS71"); // 炉次异常实绩表
  CModel tqmbs70("TQMBS70"); // 炉次异常表
  CModel tpssm11("TPSSM11"); // 作业计划编制主表
  CModel tqmts29("TQMTS29"); // 代表成分表
  CDbCommand cmd(conn);
  try
  {
    tqmts23["HEAT_NO"] = bcls_rec->Tables[0].Rows[0]["HEAT_NO"];
    Log::Trace("", "", "heat_no = {0}", tqmts23["HEAT_NO"].ToString());
    tpssm11["HEAT_NO"] = tqmts23["HEAT_NO"];
    sqlstr = " SELECT * FROM tpssm11 WHERE heat_no = @heat_no"
             "				UNION"
             "				SELECT * FROM tpssm41 WHERE heat_no = @heat_no ";
    CDbCommand cmd_tpssm11(conn);
    cmd_tpssm11.SetCommandText(sqlstr);
    cmd_tpssm11.Parameters.Set("heat_no", tpssm11["HEAT_NO"]);
    cmd_tpssm11.ExecuteReader();
    if (cmd_tpssm11.Read())
    {
      cmd_tpssm11.Fetch(tpssm11);
    }
    cmd_tpssm11.Close();
    /*tqmts23表初始化赋值*/
    tqmts23.Query("HEAT_NO");
    if (tqmts23["FIN_ST_NO"].ToString().Trim() != "")
    {
      Log::Trace("", "", "炉次已经冷检");
      return 0;
    }
    tqmts23["PONO"] = tpssm11["PONO"];
    tqmts23["ST_NO"] = tpssm11["ST_NO"];
    tqmts23["SM_PLAN_NO"] = tpssm11["SM_PLAN_NO"];
    tqmts23["CAST_DIV_NO"] = tpssm11["CAST_DIV_NO"];
    tqmts23["CAST_NO"] = tpssm11["CAST_NO"];
    tqmts23["REC_CREATOR"] = s.userid;
    tqmts23["REC_CREATE_TIME"] = datetime;
    /**查询炉次异常表,当存在待判异常时，设定炉次判定结果为不合格**/
    sqlstr = "SELECT * FROM TQMBS71  WHERE HEAT_GRADE ='2' AND HEAT_NO = @heat_no ORDER BY ABN_SERS_GRADE DESC ";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", tqmts23["HEAT_NO"]);
    cmd.ExecuteReader();
    int fechCount = 0;
    tqmts23["JUDGE_REMARK"] = "";
    tqmts23["YY_CAUSE"] = "";
    while (cmd.Read())
    {
      fechCount++;
      Log::Trace("", "", "有炉次异常情况");
      Log::Trace("", "", "tqmts23[JUDGE_REMARK] = {0}", tqmts23["JUDGE_REMARK"]);
      cmd.Fetch(tqmbs71);
      tqmbs70["ABNY_CODE"] = tqmbs71["ABNY_CODE"];
      tqmbs70.Query("ABNY_CODE");
      tqmts23["JUDGE_CODE"] = "1";
      if (fechCount == 1)
      {
        tqmts23["JUDGE_REMARK"] = tqmbs70["ABN_CONT"].ToString();
        tqmts23["YY_CAUSE"] = tqmbs70["ABNY_CODE"];
      }
      if (fechCount != 1)
      {
        tqmts23["JUDGE_REMARK"] = tqmts23["JUDGE_REMARK"].ToString() + "," + tqmbs70["ABN_CONT"].ToString();
        // tqmts23["YY_CAUSE"] = tqmbs70["ABNY_CODE"].ToString() + "," + tqmbs70["ABNY_CODE"].ToString();
      }
      tqmts23["FIN_ST_NO"] = " ";
      tqmts23["DECI_ST_NO"] = tqmbs71["ST_NO"];
      if (tqmbs71["ST_NO"].ToString().Trim() != "")
      {
        tqmts23["DECI_ST_NO"] = tqmbs71["ST_NO"];
      }
    }
    if (!fechCount)
    {
      Log::Trace("", "", "无炉次异常情况");
      Log::Trace("", "", "tqmts23.YY_CAUSE = {0}", tqmts23["YY_CAUSE"].ToString());
      Log::Trace("", "", "tqmts23.FIN_ST_NO = {0}", tqmts23["FIN_ST_NO"].ToString());
      if (tqmts23["YY_CAUSE"].ToString() <= "70" && tqmts23["YY_CAUSE"].ToString().Trim() != "" && tqmts23["YY_CAUSE"].ToString().Trim() != "1")
      {
        Log::Trace("", "", "有人工选择YY原因");
        return 0;
      }
      tqmts29["HEAT_NO"] = tqmts23["HEAT_NO"];
      tqmts23["DECI_ST_NO"] = tqmts23["ST_NO"];
      tqmts23["FIN_ST_NO"] = " "; // 梅钢所有都合格时，最终出钢记号写空
      tqmts23["JUDGE_CODE"] = "2";
      tqmts23["JUDGE_MAKER"] = s.userid;
      tqmts23["JUDGE_TIME"] = datetime;
      tqmts23["YY_CAUSE"] = "99";
      /*没有代表成分*/
      if (tqmts29.QueryCount("HEAT_NO") == 0)
      {
        Log::Trace("", "", "没有代表成分");
        tqmts23["DECI_ST_NO"] = " ";
        tqmts23["FIN_ST_NO"] = " ";
        tqmts23["JUDGE_CODE"] = " ";
        tqmts23["REP_ELM_SEL_FLAG"] = " ";
        tqmts23["JUDGE_MAKER"] = " ";
        tqmts23["JUDGE_TIME"] = " ";
        tqmts23["YY_CAUSE"] = " ";
      }
    }
    cmd.Close();
    // 更新TQMTS23表
    tqmts23.Delete("HEAT_NO");
    tqmts23.TrimOrBlank();
    tqmts23.Insert();
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
