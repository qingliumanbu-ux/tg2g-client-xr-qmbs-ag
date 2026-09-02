/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2021-04-28 15:08:16
Description: service模板
**************************************************/

#include "stdafx.h"

BM2F_ENTERACE(qmbs_test)

int f_qmbs_yc(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn);
int f_qmbs_yc(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn);
int f_qmbs_jud(CModel &ptmmsm01, EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn);
int f_qmbs_sample_select(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn);
int f_qmbs_test(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CDbCommand cmd(conn);
  CModel tmmsm01("TMMSM01");
  CModel tqmts02("TQMTS02");
  CModel tqmts9ck("TQMTS9CK");
  try
  {
    // 炉次异常测试
    /*EIClass iblk_lh;
    iblk_lh.Tables[0].Columns.Add(DT_STRING, "HEAT_NO");
    iblk_lh.Tables[0].Columns.Add(DT_STRING, "ABNY_CODE");
    iblk_lh.Tables[0].Rows.Add();

    iblk_lh.Tables[0].Rows[0]["HEAT_NO"] = "5030004";
    iblk_lh.Tables[0].Rows[0]["ABNY_CODE"] = "C3";
    doFlag = f_qmbs_yc(&iblk_lh, bcls_ret, conn);
    if (doFlag < 0)
    {
      Log::Trace("", "", "f_qmts_yc msg = [{0}]", s.msg);
    }*/

    // 测试板坯异常
    // tmmsm01["MAT_NO"] = "3320300013010";
    // tmmsm01.Query();
    // doFlag = f_qmbs_jud(tmmsm01, bcls_rec, bcls_ret,conn);
    // if (doFlag < 0)
    //{
    //	Log::Trace("", "", "f_qmbs_jud = [{0}]", s.msg);
    // }
    // 测试EPEDCALL
    /*strcpy(e.func_name[0], "f_qmbs_c3");
    bcls_rec->SetED(e);
    doFlag = f_epedcall(bcls_rec, bcls_ret);
    if (doFlag < 0)
    {
      throw CApplicationException(-1, s.msg, s.svc_name);
    }*/
    // 测试导入特采成分信息
    sqlstr = "SELECT CODE_DESC_1_CONTENT,CODE_DESC_2_CONTENT,CODE_DESC_3_CONTENT/10000,CODE_DESC_4_CONTENT/10000  FROM TEP0002 WHERE CODE_CLASS = 'QMZ1'";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteReader();
    while (cmd.Read())
    {
      tqmts02["ELM_CODE"] = cmd.GetString(1);
      tqmts02["ST_NO"] = cmd.GetString(2);
      tqmts02["ELM_CTL_MAX"] = cmd.GetDecimal(3);
      tqmts02["ELM_CTL_MIN"] = cmd.GetDecimal(4);
      tqmts02.Update("ELM_CTL_MIN,ELM_CTL_MAX", "ST_NO,ELM_CODE");
    }
    // 导入TQMTS9CK表
    /*sqlstr = "SELECT CODE,CODE_DESC_2_CONTENT,CODE_DESC_3_CONTENT/1000,CODE_DESC_4_CONTENT/1000 FROM TEP0002 WHERE CODE_CLASS = 'QMYZ'";
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteReader();
    while (cmd.Read())
    {

      tqmts9ck["ELM_CODE"] = cmd.GetString(1);
      tqmts9ck["PASS_FLAG"] = cmd.GetString(2);
      tqmts9ck["ELM_DIFF"] = cmd.GetDecimal(3);
      tqmts9ck["ELM_DIFF_PER"] = cmd.GetDecimal(4);
      tqmts9ck["REC_CREATE_TIME"] = s.datetime;
      tqmts9ck["REC_CREATOR"] = s.userid;
      tqmts9ck.Insert();
    }*/
    // 测试
    /*tmmsm01["FIN_ST_NO"] = " ";
    tmmsm01["DECI_ST_NO"] = "AP0640B6";

    Log::Trace("", "", "compare = {0}", strcmp(tmmsm01["FIN_ST_NO"], " "));
    Log::Trace("", "", "compare2 = {0}", strcmp(tmmsm01["DECI_ST_NO"], "YY000000"));*/

    // 测试板坯自动选择优秀代表样
    /*EIClass iblk_lh;
    iblk_lh.Tables[0].Columns.Add(DT_STRING, "HEAT_NO");
    iblk_lh.Tables[0].Rows.Add();

    iblk_lh.Tables[0].Rows[0]["HEAT_NO"] = "2033319";
    doFlag = f_qmbs_sample_select(&iblk_lh, bcls_ret, conn);
    if (doFlag < 0)
    {
    Log::Trace("", "", "f_qmbs_sample_select msg = [{0}]", s.msg);
    }*/
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
