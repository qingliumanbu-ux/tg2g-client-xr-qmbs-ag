/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2021-04-01 19:54:28
Description: 炉次异常SQL执行函数
传入参数：PONO，WHOLE_BACKLOG_CODE
返回值：0 --不满足异常条件，1 --满足异常条件，-1 异常
**************************************************/

#include "stdafx.h"

BM2_FUNCTION_EXPORT

int f_qmbs_yc_exc(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CDbCommand cmd(conn);
  EIClass bcls_find_value;
  CString erro_msg = " ";
  try
  {
    sqlstr = bcls_rec->Tables[0].Rows[0]["REMARK_DES"];
    CString atmc = bcls_rec->Tables[0].Rows[0]["ATMC"];
    cmd.SetCommandText(sqlstr);
    Log::Trace("", "", "sqlstr = {0}", sqlstr);
    if (sqlstr.Trim() == "")
    {
      return 0;
    }
    CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString();
    Log::Trace("", "", "heat_no ={0}", heat_no);
    cmd.Parameters.Set("heat_no", heat_no);
    cmd.Parameters.Set("HEAT_NO", heat_no);
    cmd.ExecuteQuery(bcls_find_value.Tables[0]);
    Log::Trace("", "", "bcls_find_value.Tables[0].Rows.get_Count() = {0}", bcls_find_value.Tables[0].Rows.get_Count());
    if (bcls_find_value.Tables[0].Rows.get_Count() > 0)
    {
      Log::Trace("", "", "bcls_find_value.Tables[0].Columns[0].get_DataType() = {0}", bcls_find_value.Tables[0].Columns[0].get_DataType());
      if (bcls_find_value.Tables[0].Columns[0].get_DataType() == DT_DECIMAL)
      {
        CDecimal find_value = bcls_find_value.Tables[0].Rows[0][0].ToDecimal();
        CDecimal value = bcls_rec->Tables[0].Rows[0]["value"].ToDecimal();
        Log::Trace("", "", "find_value = {0}", find_value);
        Log::Trace("", "", "atmc = {0}", atmc);
        Log::Trace("", "", "value = {0}", value);
        if (atmc == "<")
        {
          if (find_value < value)
          {
            return 1;
          }
        }
        else if (atmc == "=")
        {
          if (find_value == value)
          {
            return 1;
          }
        }
        else if (atmc == ">")
        {
          if (find_value > value)
          {
            return 1;
          }
        }
        else if (atmc == "≤")
        {
          if (find_value <= value)
          {
            return 1;
          }
        }
        else if (atmc == "≥")
        {
          if (find_value >= value)
          {
            return 1;
          }
        }
        else if (atmc == "!=")
        {
          if (find_value != value)
          {
            return 1;
          }
        }
        else
        {
          return 0;
        }
        return 0;
      }
      else if (bcls_find_value.Tables[0].Columns[0].get_DataType() == DT_STRING)
      {
        CString find_value = bcls_find_value.Tables[0].Rows[0][0].ToString();
        CString value = bcls_rec->Tables[0].Rows[0]["value"].ToString();
        Log::Trace("", "", "find_value = {0}", find_value);
        Log::Trace("", "", "atmc = {0}", atmc);
        Log::Trace("", "", "value = {0}", value);
        if (atmc == "<")
        {
          if (find_value < value)
          {
            return 1;
          }
        }
        else if (atmc == "=")
        {
          if (find_value == value)
          {
            return 1;
          }
        }
        else if (atmc == ">")
        {
          if (find_value > value)
          {
            return 1;
          }
        }
        else if (atmc == "≤")
        {
          if (find_value <= value)
          {
            return 1;
          }
        }
        else if (atmc == "≥")
        {
          if (find_value >= value)
          {
            return 1;
          }
        }
        else if (atmc == "!=")
        {
          if (find_value != value)
          {
            return 1;
          }
        }
        else
        {
          return 0;
        }
        return 0;
      }
    }
  }
  catch (CDbException &ex)
  {
    CFormattable arguments[] = {ex.GetCode(), ex.GetMsg()};
    CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
    CString str = sqlstr + "\r\n" + ex.GetMsg();
    erro_msg = ex.GetMsg();
    strncpy(s.sysmsg, (const char *)str, sizeof(s.sysmsg) - 1);
    s.flag = -1;
    doFlag = -1;
  }
  catch (CApplicationException &ex)
  {
    s.flag = ex.GetCode();
    erro_msg = ex.GetMsg();
    doFlag = -1;
  }
  catch (CException &ex)
  {
    strcpy(s.msg, ex.GetMsg());
    erro_msg = ex.GetMsg();
    s.flag = ex.GetCode();
    doFlag = -1;
  }
  if (doFlag < 0)
  {
    CString sqlstr2 = " INSERT INTO TQMTS74(REC_CREATOR, REC_CREATE_TIME, HEAT_NO, ABNY_CODE, ERROR_MESSAGE, WHOLE_BACKLOG_CODE, ATMC, REMARK_DES, value)"
                      "		VALUES(@REC_CREATOR, @REC_CREATE_TIME, @HEAT_NO, @ABNY_CODE, @ERROR_MESSAGE, @WHOLE_BACKLOG_CODE, @ATMC, @REMARK_DES, @value) ";
    cmd.SetCommandText(sqlstr2);
    cmd.Parameters.Set("REC_CREATOR", s.userid);
    cmd.Parameters.Set("REC_CREATE_TIME", datetime);
    cmd.Parameters.Set("HEAT_NO", bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString());
    cmd.Parameters.Set("REMARK_DES", bcls_rec->Tables[0].Rows[0]["REMARK_DES"].ToString());
    cmd.Parameters.Set("ABNY_CODE", bcls_rec->Tables[0].Rows[0]["ABNY_CODE"].ToString());
    cmd.Parameters.Set("WHOLE_BACKLOG_CODE", bcls_rec->Tables[0].Rows[0]["WHOLE_BACKLOG_CODE"].ToString());
    cmd.Parameters.Set("ATMC", bcls_rec->Tables[0].Rows[0]["ATMC"].ToString());
    cmd.Parameters.Set("value", bcls_rec->Tables[0].Rows[0]["value"].ToString());
    Log::Trace("", "", "erro_msg = {0}", erro_msg);
    cmd.Parameters.Set("ERROR_MESSAGE", erro_msg);
    Log::Trace("", "", "line = {0}", __LINE__);
    cmd.ExecuteNonQuery();
    Log::Trace("", "", "line = {0}", __LINE__);
  }
  return doFlag;
}
