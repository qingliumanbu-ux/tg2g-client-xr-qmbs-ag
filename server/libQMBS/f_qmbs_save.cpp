/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-06-08 19:54:28
Description: 新增修改删除综合函数
**************************************************/

#include "stdafx.h"

BM2_FUNCTION_EXPORT

int f_qmbs_ins(CDataTable *data_table, EIClass *bcls_ret, CDbConnection *conn) // 新增
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  try
  {
    /*新增*/
    // 程序公共CDbCommand
    CDbCommand cmd(conn);
    /* 申明新增语句 */
    CString sql_ins = "INSERT INTO T";
    /* 获取前台传入的窗体名称 */
    CString form_name = (CString)data_table->get_TableName();
    /* 拼接sql语句 */
    sql_ins += form_name;
    /* 打印表名 */
    Log::Trace("", "", "table_name{0}", (const char *)form_name);
    sql_ins += " ( ";
    /* 获取压入表名称 */
    for (int j = 0; j < data_table->Columns.get_Count(); j++)
    {
      /* 拼接列名 */
      sql_ins += data_table->Columns[j].get_ColumnName();
      /* 判断拼接,若相等的的时候，则拼接此列 */
      if (j == data_table->Columns.get_Count() - 1)
      {
        sql_ins += " ) VALUES ( ";
      }
      else
      {
        sql_ins += ",";
      }
    }
    /* 打印SQL_INS语句 */
    Log::Trace("QMBS", "qmbs_save", "sql_ins[{0}]", (const char *)sql_ins);
    /*获取传入行数*/
    int count = data_table->Rows.get_Count();
    /*循环压入数据表行数*/
    for (int i = 0; i < count; i++)
    {
      /*申明sql值*/
      CString sql_value;
      /*循环列数*/
      for (int j = 0; j < data_table->Columns.get_Count(); j++)
      {
        if (data_table->Columns[j].get_ColumnName() == "REC_CREATOR")
        {
          sql_value += "@rec_creator";
        }
        else if (data_table->Columns[j].get_ColumnName() == "REC_REVISOR")
        {
          sql_value += "@rec_revisor";
        }
        else if (data_table->Columns[j].get_ColumnName() == "REC_CREATE_TIME")
        {
          sql_value += "@rec_create_time";
        }
        else if (data_table->Columns[j].get_ColumnName() == "REC_REVISE_TIME")
        {
          sql_value += "@rec_revise_time";
        }
        else if (data_table->Columns[j].get_ColumnName() == "VERSION")
        {
          sql_value += "0";
        }
        else if (data_table->Columns[j].get_ColumnName() == "SEND_TIME")
        {
          sql_value += "' '";
        }
        else if (data_table->Columns[j].get_ColumnName() == "SEND_MAKER")
        {
          sql_value += "' '";
        }
        else if (data_table->Columns[j].get_ColumnName() == "VALID_FLAG")
        {
          sql_value += "' '";
        }
        else
        {
          Log::Trace("", "", "*{0}*", (const char *)((CString)data_table->Rows[i][j]).Trim());
          if (((CString)data_table->Rows[i][j]).IsEmpty())
          {
            data_table->Rows[i][j] = " ";
            Log::Trace("", "", "****{0}****", (const char *)data_table->Rows[i][j].ToString());
          }
          sql_value += "'" + ((CString)data_table->Rows[i][j]).Replace("'", "''") + "'";
        }
        if (j == data_table->Columns.get_Count() - 1)
        {
          sql_value += " ) ";
        }
        else
        {
          sql_value += ",";
        }
      }
      /*拼接成完整的的sql语句*/
      CString sql = sql_ins + sql_value;
      /* 打印sql语句 */
      Log::Trace("", "", "sql{0}", (const char *)sql);
      /* 连接数据库，对在线表进行操作 */
      CDbCommand comm2(sql, conn);
      comm2.Parameters.Set("rec_creator", s.userid);
      comm2.Parameters.Set("rec_revisor", s.userid);
      comm2.Parameters.Set("rec_create_time", datetime);
      comm2.Parameters.Set("rec_revise_time", datetime);
      comm2.ExecuteNonQuery();
    }
    /*新增结束*/
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
int f_qmbs_upd(CDataTable *data_table, CDataTable *dt_key, EIClass *bcls_ret, CDbConnection *conn) // 修改
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  // 程序公共CDbCommand
  CDbCommand cmd(conn);
  try
  {
    Log::Trace("", "", "update start");
    //-----------------------------------------------
    // 获取要操作的行前台传入的行数
    int count = data_table->Rows.get_Count();
    CString formName = (CString)data_table->get_TableName();
    //-----------------------------------------------
    // 循环获取列名和列值，插入历史表
    for (int i = 0; i < count; i++)
    {
      CString sql_ins = "INSERT INTO H" + formName + " ( ";
      // 要插入历史表的值
      CString ins_value = "";
      CString sql_where = " ";
      CString column_name = " ";
      // 循环获取列名
      for (int j = 0; j < data_table->Columns.get_Count(); j++)
      {
        if (data_table->Columns[j].get_ColumnName() == "DU_MAKER")
        {
          column_name += "@du_maker";
        }
        else if (data_table->Columns[j].get_ColumnName() == "DU_TIME")
        {
          column_name += "@du_time";
        }
        else if (data_table->Columns[j].get_ColumnName() == "DU_FLAG")
        {
          column_name += "'U'";
        }
        else
        {
          column_name += data_table->Columns[j].get_ColumnName();
        }
        if (j == data_table->Columns.get_Count() - 1)
        {
          column_name += " FROM T" + formName;
        }
        else
        {
          column_name += ",";
        }

        sql_ins += data_table->Columns[j].get_ColumnName();
        if (j == data_table->Columns.get_Count() - 1)
        {
          sql_ins += " ) SELECT ";
        }
        else
        {
          sql_ins += ",";
        }
      }
      for (int k = 0; k < dt_key->Rows.get_Count(); k++)
      {
        if (0 == k)
        {
          sql_where += " WHERE " + dt_key->Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
        }
        else
        {
          sql_where += " AND " + dt_key->Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
        }
        cmd.Parameters.Set("colName_" + CConvert::ToString(k), (CString)data_table->Rows[i][dt_key->Rows[k]["COLNAME"].ToString().Trim()].ToString().Trim());
      }

      sqlstr = sql_ins + column_name + sql_where;
      Log::Trace("", "", "HIS_INSERT sqlstr{0}", sqlstr);
      cmd.SetCommandText(sqlstr);
      cmd.Parameters.Set("du_maker", s.userid);
      cmd.Parameters.Set("du_time", datetime);
      try
      {
        cmd.ExecuteNonQuery();
      }
      catch (CDbException &ex)
      {
        // 无历史表错误忽略，让开发者可以任意配置表，可以有历史表也可以没有历史表
        if (ex.GetCode() != -204)
        {
          CFormattable arguments[] = {ex.GetCode(), ex.GetMsg()};
          CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
          CString str = sqlstr + "\r\n" + ex.GetMsg();
          strncpy(s.sysmsg, (const char *)str, sizeof(s.sysmsg) - 1);
          s.flag = -1;
          doFlag = -1;
        }
      }
      cmd.Close();
    }
    //-----------------------------------------------
    // 循环更新在线表
    for (int i = 0; i < count; i++)
    {
      // 插入历史表的SQL语句
      CString sql_upd = "UPDATE T" + formName + " SET ";
      CString sql_where = " ";
      for (int j = 0; j < data_table->Columns.get_Count(); j++)
      {
        // 在线表数据修改sql拼接
        if (data_table->Columns[j].get_ColumnName() == "REC_REVISOR")
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = @rec_revisor,";
        }
        else if (data_table->Columns[j].get_ColumnName() == "REC_REVISE_TIME")
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = @rec_revise_time,";
        }
        else if (data_table->Columns[j].get_ColumnName() == "VERSION")
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = version + 1,";
        }
        else if (data_table->Columns[j].get_ColumnName() == "SEND_TIME") // 更新SEND_TIME,SEND_MAKER,VALID_FLAG为空
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = ' ',";
        }
        else if (data_table->Columns[j].get_ColumnName() == "SEND_MAKER") // 更新SEND_TIME,SEND_MAKER,VALID_FLAG为空
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = ' ',";
        }
        else if (data_table->Columns[j].get_ColumnName() == "VALID_FLAG") // 更新SEND_TIME,SEND_MAKER,VALID_FLAG为空
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = ' ',";
        }
        else
        {
          sql_upd += data_table->Columns[j].get_ColumnName() + " = '" + ((CString)data_table->Rows[i][j]).TrimOrBlank().Replace("'", "''") + "',";
        }
        // sql更新的条件根据主键更新
        if (j == data_table->Columns.get_Count() - 1)
        {
          // 截取字符串的最后一位的逗号
          sql_upd = sql_upd.Substring(0, sql_upd.GetLength() - 1);
        }
      }
      // 拼接where
      for (int k = 0; k < dt_key->Rows.get_Count(); k++)
      {
        if (0 == k)
        {
          sql_where += " WHERE " + dt_key->Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
        }
        else
        {
          sql_where += " AND " + dt_key->Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
        }
        cmd.Parameters.Set("colName_" + CConvert::ToString(k), (CString)data_table->Rows[i][dt_key->Rows[k]["COLNAME"].ToString().Trim()].ToString().Trim());
      }
      // 更新在线表
      sqlstr = sql_upd + sql_where;
      Log::Trace("", "", "UPDATE sql_upd{0}", sqlstr);
      cmd.SetCommandText(sqlstr);
      cmd.Parameters.Set("rec_revisor", s.userid);
      cmd.Parameters.Set("rec_revise_time", datetime);
      cmd.ExecuteNonQuery();
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
int f_qmbs_del(CDataTable *data_table, CDataTable *dt_key, EIClass *bcls_ret, CDbConnection *conn) // 删除
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  try
  {
    // ----------------------------------------
    // 定义公共CDbCommand
    CDbCommand cmd(conn);
    // 获取要前台传入的值
    CString from_name = (CString)data_table->get_TableName();
    // 新增历史表记录
    CString sql_ins = "INSERT INTO H" + from_name + " (";
    // 取得单行传入信息
    for (int j = 0; j < data_table->Columns.get_Count(); j++)
    {
      sql_ins += data_table->Columns[j].get_ColumnName();

      if (j == data_table->Columns.get_Count() - 1)
      {
        sql_ins += " ) VALUES ( ";
      }
      else
      {
        sql_ins += " , ";
      }
    }
    // 获取要删除的行数，逐行进行处理
    int count = data_table->Rows.get_Count();
    for (int i = 0; i < count; i++)
    {
      CString sql_value;
      // 删除SQL语句
      CString sql_del = "DELETE FROM T" + from_name + " WHERE 1 = 1 ";
      // 先逐列新增入历史表
      for (int j = 0; j < data_table->Columns.get_Count(); j++)
      {
        if (data_table->Columns[j].get_ColumnName() == "DU_MAKER")
        {
          sql_value += "@du_maker";
        }
        else if (data_table->Columns[j].get_ColumnName() == "DU_TIME")
        {
          sql_value += "@du_time";
        }
        else if (data_table->Columns[j].get_ColumnName() == "DU_FLAG")
        {
          sql_value += "'D'";
        }
        else
        {
          sql_value += " @" + data_table->Columns[j].get_ColumnName();
          cmd.Parameters.Set(data_table->Columns[j].get_ColumnName(), (CString)data_table->Rows[i][j].ToString().TrimOrBlank());
        }

        if (j == data_table->Columns.get_Count() - 1)
        {
          sql_value += " ) ";
        }
        else
        {
          sql_value += " , ";
        }
      }
      sqlstr = sql_ins + sql_value;
      // 执行历史表新增操作
      cmd.SetCommandText(sqlstr);
      cmd.Parameters.Set("du_maker", s.userid);
      cmd.Parameters.Set("du_time", datetime);
      try
      {
        cmd.ExecuteNonQuery();
      }
      catch (CDbException &ex)
      {
        // 无历史表错误忽略，让开发者可以任意配置表，可以有历史表也可以没有历史表
        if (ex.GetCode() != -204)
        {
          CFormattable arguments[] = {ex.GetCode(), ex.GetMsg()};
          CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
          CString str = sqlstr + "\r\n" + ex.GetMsg();
          strncpy(s.sysmsg, (const char *)str, sizeof(s.sysmsg) - 1);
          s.flag = -1;
          doFlag = -1;
        }
      }
      cmd.Close();
      // 根据前台传入主键删除
      for (int k = 0; k < dt_key->Rows.get_Count(); k++)
      {
        if (data_table->Rows[i][dt_key->Rows[k]["COLNAME"].ToString().Trim()].ToString().Trim() != "")
        {
          sql_del += " AND " + dt_key->Rows[k]["COLNAME"].ToString().Trim() + "=@colName_" + CConvert::ToString(k);
          cmd.Parameters.Set("colName_" + CConvert::ToString(k), (CString)data_table->Rows[i][dt_key->Rows[k]["COLNAME"].ToString().Trim()].ToString().Trim());
        }
      }
      // 执行在线表删除操作
      sqlstr = sql_del;
      cmd.SetCommandText(sqlstr);
      Log::Trace("", "", "sql[{0}][{1}]", sqlstr, data_table->Rows[i][dt_key->Rows[0]["COLNAME"].ToString().Trim()].ToString().Trim());
      cmd.ExecuteNonQuery();
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

int f_qmbs_save(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  try
  {
    for (size_t i = 0; i < bcls_rec->Tables.get_Count(); i++)
    {
      CString table_name = bcls_rec->Tables[i].get_TableName();
      int position = table_name.Find("_") + 1;
      if (position > 1 && table_name.Substring(position, table_name.GetLength() - position) == "ADD")
      {
        bcls_rec->Tables[i].set_TableName(table_name.Substring(0, position - 1));
        doFlag = f_qmbs_ins(&bcls_rec->Tables[i], bcls_ret, conn);
        if (doFlag < 0)
        {
          throw CApplicationException(-1, s.msg, log.Location);
        }
      }
      else if (position > 1 && table_name.Substring(position, table_name.GetLength() - position) == "MODIFY")
      {
        bcls_rec->Tables[i].set_TableName(table_name.Substring(0, position - 1));
        doFlag = f_qmbs_upd(&bcls_rec->Tables[i], &bcls_rec->Tables["DT_KEY"], bcls_ret, conn);
        if (doFlag < 0)
        {
          throw CApplicationException(-1, s.msg, log.Location);
        }
      }
      else if (position > 1 && table_name.Substring(position, table_name.GetLength() - position) == "DELETE")
      {
        bcls_rec->Tables[i].set_TableName(table_name.Substring(0, position - 1));
        doFlag = f_qmbs_del(&bcls_rec->Tables[i], &bcls_rec->Tables["DT_KEY"], bcls_ret, conn);
        if (doFlag < 0)
        {
          throw CApplicationException(-1, s.msg, log.Location);
        }
      }
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
