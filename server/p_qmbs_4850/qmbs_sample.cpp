/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-09-06 15:08:16
Description: 试样数据查询
**************************************************/

#include "stdafx.h"

BM2F_ENTERACE(qmbs_sample)
int f_qmbs_sample(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CDbCommand cmd(conn);
  try
  {
    // 查询TQMTS25表
    CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"];
    CString st_no = bcls_rec->Tables[0].Rows[0]["ST_NO"];
    CString st_sample_no = bcls_rec->Tables[0].Rows[0]["ST_SAMPLE_NO"];
    Log::Trace("", "", "heat_no = {0}", heat_no);
    if (st_sample_no.Substring(0, 1) == "1") // 钢水
    {
      sqlstr = " SELECT t1.ELM_CODE, T1.ELM_NAME, T1.MAIN_MIN, T1.MAIN_MAX, T1.MAIN_AIM, T1.SPE_MIN, T1.SPE_MAX, T2.ELM_ACT, T2.ELM_ACT_OLD,T2.ELM_OK,T1.ELM_CTL_MIN,T1.ELM_CTL_MAX  FROM TQMTS02 T1"
               "			LEFT JOIN(SELECT * FROM TQMTS25 WHERE SAMPLE_ENTR_NO = @heat_no AND ST_SAMPLE_NO = @st_sample_no) T2"
               "			ON T1.ELM_CODE = T2.ELM_CODE"
               "			WHERE T1.ST_NO = @st_no ";
    }
    else if (st_sample_no.Substring(0, 1) == "2") // 渣样
    {
      sqlstr = " SELECT * FROM TQMTS26 WHERE HEAT_NO = @heat_no AND ST_SAMPLE_NO = @st_sample_no ";
    }
    else if (st_sample_no.Substring(0, 1) == "3") // 铁水样
    {
      sqlstr = " SELECT * FROM TQMTS25 WHERE SAMPLE_ENTR_NO = @heat_no AND ST_SAMPLE_NO = @st_sample_no ";
    }
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", heat_no);
    cmd.Parameters.Set("st_no", st_no);
    cmd.Parameters.Set("st_sample_no", st_sample_no);
    cmd.ExecuteQuery(bcls_ret->Tables[0]);
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
