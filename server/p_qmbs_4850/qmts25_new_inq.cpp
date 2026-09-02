/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-10-01 14:48:51
Description: 工序成分实际查询
**************************************************/

#include "stdafx.h"
BM2F_ENTERACE(qmts25_new_inq)

int f_qmts25_new_inq(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
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
    CString sql = " WITH qmts25 AS("
                  "			SELECT"
                  "			*"
                  "			FROM"
                  "			("
                  "			SELECT"
                  "			T1.ST_SAMPLE_NO,"
                  "			T1.HEAT_NO,"
                  "			T1.ELM_NAME,"
                  "			T1.ELM_ACT,"
                  "			T1.ELM_OK"
                  "			FROM"
                  "			TQMTS25 T1"
                  "			)"
                  "			PIVOT("
                  "			SUM(ELM_ACT),"
                  "			SUM(ELM_OK) AS OK"
                  "			FOR ELM_NAME IN('W' AS W,"
                  "			'Ca' AS Ca,"
                  "			'Pb' AS Pb,"
                  "			'Mo' AS Mo,"
                  "			'SPEC3' AS SPEC3,"
                  "			'C' AS C,"
                  "			'Mn' AS Mn,"
                  "			'B' AS B,"
                  "			'O' AS O,"
                  "			'H' AS H,"
                  "			'Als' AS Als,"
                  "			'Sb' AS Sb,"
                  "			'CE' AS CE,"
                  "			'Si' AS Si,"
                  "			'Ni' AS Ni,"
                  "			'As' AS AST,"
                  "			'SPEC2' AS SPEC2,"
                  "			'N' AS N,"
                  "			'CEQ' AS CEQ,"
                  "			'P' AS P,"
                  "			'Cr' AS Cr,"
                  "			'Sn' AS Sn,"
                  "			'SPEC1' AS SPEC1,"
                  "			'S' AS S,"
                  "			'Nb' AS Nb,"
                  "			'Al' AS Al,"
                  "			'Ti' AS Ti,"
                  "			'Alt' AS Alt,"
                  "			'Cu' AS Cu,"
                  "			'V' AS V,"
                  "			'CMS' AS CMS"
                  "			)"
                  "			)"
                  "			)"
                  "			SELECT"
                  "			TQMTS23.FIN_ST_NO,"
                  "			TQMTS23.ST_NO,"
                  "			TQMTS24.ANALYSE_TIME,"
                  "			TQMTS24.PONO,"
                  "			TQMTS24.HEAT_NO,"
                  "			TQMTS24.REP_ELM_SEL_FLAG,"
                  "			TQMTS24.SM_PLAN_NO,"
                  "			TQMTS24.ST_NO,"
                  "			TQMTS24.JUDGE_CODE,"
                  "			TQMTS24.ST_SAMPLE_DIV,"
                  "			TQMTS24.GAS_TYPE_DIV,"
                  "			TQMTS24.ST_SAMPLE_SEQ,"
                  "			TQMTS24.PREC_ST_NO,"
                  "			TQMTS24.FIN_ST_NO,"
                  "			TQMTS24.COMPANY_CODE,"
                  "			TQMTS24.COMPANY_NAME,"
                  "			TMMSM21.PROD_SHIFT_NO,"
                  "			TMMSM21.PROD_SHIFT_GROUP,"
                  "			TQMTS0X1.LABEL1 AS ST_NO_LABEL1,"
                  "			TQMTS0X2.LABEL1 AS FIN_ST_NO_LABEL1,"
                  "			qmts25.*"
                  "			FROM"
                  "			TQMTS24"
                  "			LEFT JOIN qmts25"
                  "			ON"
                  "			TQMTS24.ST_SAMPLE_NO = qmts25.ST_SAMPLE_NO"
                  "			AND TQMTS24.HEAT_NO = qmts25.HEAT_NO"
                  "			LEFT JOIN TQMTS23"
                  "			ON"
                  "			TQMTS24.HEAT_NO = TQMTS23.HEAT_NO"
                  "			LEFT JOIN TMMSM21"
                  "			ON"
                  "			TQMTS24.HEAT_NO = TMMSM21.HEAT_NO"
                  "			LEFT JOIN TQMTS0X TQMTS0X1"
                  "			ON TQMTS23.ST_NO = TQMTS0X1.ST_NO"
                  "			LEFT JOIN TQMTS0X  TQMTS0X2"
                  "			ON TQMTS23.FIN_ST_NO = TQMTS0X2.ST_NO ";

    CString sql_where = " WHERE TQMTS24.ST_SAMPLE_DIV = '1'";
    CString sql_order_by = " ORDER BY TQMTS24.ANALYSE_TIME DESC";

    /*拼接查询sql条数语句*/
    CString sql_count = "SELECT COUNT(*) FROM ( ";

    /*获取查询条件传入列数*/
    int count_row = bcls_rec->Tables[0].Rows.get_Count();
    Log::Trace("", "", "count_row = {0}", count_row);
    for (int i = 0; i < count_row; i++)
    {
      Log::Trace("", "", "bcls_rec->Tables[0].Rows[0][i].ToString().Trim()= {0},OP_VALUE = {1}", bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString().Trim(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
      /*如果查询条件的值为空则跳出*/
      if (bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim().IsEmpty())
      {
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "analyse_time_start")
      {
        sql_where += " AND TQMTS24.ANALYSE_TIME >= @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString();
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "analyse_time_end")
      {
        sql_where += " AND TQMTS24.ANALYSE_TIME <= @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString();
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "st_sample_no")
      {
        sql_where += " AND TQMTS24." + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + " LIKE '%'||@" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + "||'%'";
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "fin_st_no_label1")
      {
        sql_where += " AND TQMTS0X2.LABEL1 LIKE @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + "||'%'";
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "prod_shift_group")
      {
        sql_where += " AND TMMSM21." + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + " LIKE @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + "||'%'";
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "prod_shift_no")
      {
        sql_where += " AND TMMSM21." + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + " LIKE @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + "||'%'";
        cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
        continue;
      }
      if (bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() == "auto_flash")
      {
        continue;
      }
      Log::Trace("", "", "条件查询sql {0}++[{1}],", i, bcls_rec->Tables[0].Columns[i].get_ColumnName() + ":" + bcls_rec->Tables[1].Rows[0][0].ToString().Trim());

      sql_where += " AND TQMTS24." + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + " LIKE @" + bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString() + "||'%'";
      cmd.Parameters.Set(bcls_rec->Tables[0].Rows[i]["ITEM_CODE"].ToString(), bcls_rec->Tables[0].Rows[i]["OP_VALUE"].ToString().Trim());
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
