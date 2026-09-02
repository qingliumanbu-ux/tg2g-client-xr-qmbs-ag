/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-11-13 14:48:51
Description: 各种定制化查询模板
**************************************************/

#include "stdafx.h"
BM2F_ENTERACE(qmbs_xx_inq)

int f_qmbs_xx_inq(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";

  try
  {
    int record_count_per_page = 0; /* 每页记录数 */
    int current_page_no = 0;       /* 需查询的页号,从0开始计数 */
    int start_row = 0;             /* 将要压入outBlock的起始行 */
    /* 获取传入的表名 */
    /* 每页记录数 */
    record_count_per_page = bcls_rec->Tables[1].Rows[0]["PAGE_SIZE"];
    /* 需查询的页号 */
    current_page_no = bcls_rec->Tables[1].Rows[0]["PAGE_NUM"];
    CDbCommand cmd(conn);

    /*拼接查询sql语句*/
    CString sql = "select * from TQMTS24";

    CString sql_where = " WHERE 1 = 1";
    CString sql_order_by = " ";

    /*拼接查询sql条数语句*/
    CString sql_count = "SELECT COUNT(*) FROM ( ";

    /*获取查询条件传入列数*/
    int count_row = bcls_rec->Tables[0].Columns.get_Count();

    for (int i = 0; i < count_row; i++)
    {
      Log::Trace("", "", "bcls_rec->Tables[0].Rows[0][i].ToString().Trim()= {0}", bcls_rec->Tables[0].Rows[0][i].ToString().Trim());
      /*如果查询条件的值为空则跳出*/
      if (bcls_rec->Tables[0].Rows[0][i].ToString().Trim().IsEmpty())
      {
        continue;
      }
      Log::Trace("", "", "条件查询sql {0}++[{1}],", i, bcls_rec->Tables[0].Columns[i].get_ColumnName() + ":" + bcls_rec->Tables[1].Rows[0][0].ToString().Trim());

      sql_where += " AND " + bcls_rec->Tables[0].Columns[i].get_ColumnName() + " LIKE @" + bcls_rec->Tables[0].Columns[i].get_ColumnName() + "||'%'";
      cmd.Parameters.Set(bcls_rec->Tables[0].Columns[i].get_ColumnName(), bcls_rec->Tables[0].Rows[0][i].ToString().Trim());
    }

    /*连接sql语句*/
    sqlstr = sql_count + sql + sql_where + ")";
    cmd.SetCommandText(sqlstr);

    /*获取条数*/
    CDecimal rc = cmd.ExecuteScalar();

    /*把值压入RC中，传出前台*/
    bcls_ret->ExtendedProperties.Add("RC", rc.ToString());

    /*完成拼接查询sql*/
    sqlstr = sql + sql_where + sql_order_by;
    Log::Trace("", "", "条件查询sql[{0}],", sqlstr);
    cmd.SetCommandText(sqlstr);

    start_row = record_count_per_page * (current_page_no - 1);
    if (start_row > rc.ToDouble())
    {
      start_row = 0;
    }
    Log::Trace("", __FUNCTION__, "current_page_no		= [{0}]", current_page_no);
    Log::Trace("", __FUNCTION__, "record_count_per_page = [{0}]", record_count_per_page);
    Log::Trace("", __FUNCTION__, "start_row			    = [{0}]", start_row);

    int count = cmd.ExecuteQuery(bcls_ret->Tables[0], start_row, record_count_per_page);
    bcls_ret->Tables[0].set_TableName("TQMTS24");

    // 返回分页总数量信息

    bcls_ret->Tables.Add("PageInfo");
    bcls_ret->Tables["PageInfo"].Columns.Add(DT_DECIMAL, "TotalRecordCount");
    bcls_ret->Tables["PageInfo"].Rows.Add();
    bcls_ret->Tables["PageInfo"].Rows[0]["TotalRecordCount"] = rc;
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
