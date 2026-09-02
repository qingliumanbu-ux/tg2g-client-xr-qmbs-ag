/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-11-08 15:08:16
Description: service模板
**************************************************/

#include "stdafx.h"

BM2F_ENTERACE(qmbsm2_single_inq)

int f_qmbsm2_single_inq(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CDbCommand cmd(conn);
  try
  {
	  CString sql = "SELECT * FROM " + bcls_rec->Tables[0].get_TableName();
	  CString sql_where = " ";
	  for (int k = 0; k < bcls_rec->Tables[1].Rows.get_Count(); k++)
	  {
		  if (0 == k)
		  {
			  sql_where += " WHERE " + bcls_rec->Tables[1].Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
		  }
		  else
		  {
			  sql_where += " AND " + bcls_rec->Tables[1].Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
		  }
		  cmd.Parameters.Set("colName_" + CConvert::ToString(k), (CString)bcls_rec->Tables[0].Rows[0][bcls_rec->Tables[1].Rows[k]["COLNAME"].ToString().Trim()].ToString().Trim());
	  }
	  sqlstr = sql + sql_where;
	  Log::Trace("", "", "sql = {0}", sqlstr);
	  cmd.SetCommandText(sqlstr);
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
