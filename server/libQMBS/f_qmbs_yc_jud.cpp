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
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CModel tqmts23("TQMTS23"); // 炉次质量信息表
  CModel tqmbs71("TQMBS71"); // 炉次异常实绩表
  CModel tqmbs70("TQMBS70"); // 炉次异常表
  CDbCommand cmd(conn);
  try
  {
    tqmts23["HEAT_NO"] = bcls_rec->Tables[0].Rows[0]["HEAT_NO"];
    tqmts23["PONO"] = bcls_rec->Tables[0].Rows[0]["PONO"];
    tqmts23.Query("HEAT_NO");
    /**查询炉次异常表,当存在待判异常时，设定炉次判定结果为不合格**/
    sqlstr = "SELECT * FROM TQMBS71  WHERE HEAT_GRADE ='2' AND HEAT_NO = @heat_no ORDER BY ABN_SERS_GRADE DESC ";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", tqmts23["HEAT_NO"]);
    cmd.ExecuteReader();
    if (cmd.Read())
    {
      cmd.Fetch(tqmbs71);
    }
    else
    {
      Log::Trace("", "", "无炉次异常情况，return 0");
      return 0;
    }
    cmd.Close();
    // 更新TQMTS23表
    tqmbs70["ABNY_CODE"] = tqmbs71["ABNY_CODE"];
    tqmbs70.Query("ABNY_CODE");
    tqmts23["JUDGE_MAKER"] = s.userid;
    tqmts23["JUDGE_TIME"] = datetime;
    tqmts23["JUDGE_CODE"] = "2";
    tqmts23["JUDGE_REMARK"] = "不合格";
    tqmts23["JUDGE_REMARK"] = tqmts23["JUDGE_REMARK"].ToString() + "," + tqmbs70["ABN_CONT"].ToString();
    tqmts23["FIN_ST_NO"] = " ";
    tqmts23["DECI_ST_NO"] = "YY000000";
    if (tqmbs71["ST_NO"].ToString().Trim() != "")
    {
      tqmts23["DECI_ST_NO"] = tqmbs71["ST_NO"];
    }
    tqmts23.Update("JUDGE_MAKER,JUDGE_TIME,JUDGE_CODE,FIN_ST_NO,DECI_ST_NO,JUDGE_REMARK", "HEAT_NO");
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
