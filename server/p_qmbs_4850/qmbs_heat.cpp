/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-09-06 15:08:16
Description: 炉次异常画面 炉次查询
**************************************************/

#include "stdafx.h"

BM2F_ENTERACE(qmbs_heat)
int f_qmbs_heat(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CDbCommand cmd(conn);
  try
  {
    // 查询TQMTS24表
    CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"];
    Log::Trace("", "", "heat_no = {0}", heat_no);
    sqlstr = " SELECT * FROM TQMTS24 WHERE PONO = (SELECT pono FROM PSSM.tpssm11 WHERE heat_no = @heat_no "
             "			UNION"
             "			SELECT pono FROM PSSM.tpssm41 WHERE heat_no = @heat_no ) ";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", heat_no);
    cmd.ExecuteQuery(bcls_ret->Tables[0]);

    // 查询TQMBS71
    bcls_ret->Tables.Add();
    sqlstr = "SELECT * FROM TQMBS71 WHERE heat_no = @heat_no";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(bcls_ret->Tables[1]);

    // 查询板坯异常
    bcls_ret->Tables.Add();
    sqlstr = " SELECT MAT_NO,MODEL_JUDGE,"
             "			MODEL_TREAT,"
             "			MODEL_EVT_1,"
             "			MODEL_EVT_2,"
             "			MODEL_EVT_3,"
             "			MODEL_EVT_4,"
             "			MODEL_STD_1,"
             "			MODEL_ACT_1,"
             "			MODEL_JUDGE_1,"
             "			MODEL_STD_2,"
             "			MODEL_ACT_2,"
             "			MODEL_JUDGE_2,"
             "			MODEL_STD_3,"
             "			MODEL_ACT_3,"
             "			MODEL_JUDGE_3,"
             "			MODEL_STD_4,"
             "			MODEL_ACT_4,"
             "			MODEL_JUDGE_4,"
             "			MODEL_START_1,"
             "			MODEL_START_2,"
             "			MODEL_START_3,"
             "			MODEL_START_4,"
             "			MODEL_END_1,"
             "			MODEL_END_2,"
             "			MODEL_END_3,"
             "			MODEL_END_4"
             "			FROM MMSM.TMMSM01 WHERE (MODEL_EVT_1 <> ' ' OR MODEL_EVT_2 <> ' ' OR MODEL_EVT_3 <> ' ' OR MODEL_EVT_4 <> ' ')"
             "			AND heat_no = @heat_no ";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(bcls_ret->Tables[2]);

    // 查询物料信息
    bcls_ret->Tables.Add();
    sqlstr = " SELECT "
             "			MAT_NO,"
             "			HEAT_NO,"
             "			MAT_DESTION,"
             "			HOLD_REMARK,"
             "			HOLD_CAUSE_CODE,"
             "			PREC_ST_NO,"
             "			DECI_ST_NO,"
             "			ST_NO"
             "			FROM TMMSM01 WHERE heat_no = @heat_no ";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(bcls_ret->Tables[3]);

    // 查询轧制质量信息
    bcls_ret->Tables.Add();
    sqlstr = " SELECT * FROM TMMSM01A WHERE MAT_NO IN(SELECT MAT_NO FROM TMMSM01 WHERE HEAT_NO = @heat_no) ";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(bcls_ret->Tables[4]);
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
