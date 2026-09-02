/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     2.0
Date:        2023-06-12 19:54:28
Description: 炉次异常总调函数
传入参数：	HEAT_NO ： 熔炼号
      ABNY_CODE ： 炉次异常代码，在QMBS70中定义；当调用工序的全部异常时，可以不用传入
调用方式
EIClass iblk_lh;
iblk_lh.Tables[0].Columns.Add(DT_STRING, "HEAT_NO");
iblk_lh.Tables[0].Columns.Add(DT_STRING, "ABNY_CODE");
iblk_lh.Tables[0].Rows.Add();

iblk_lh.Tables[0].Rows[0]["HEAT_NO"] = heat_no;
iblk_lh.Tables[0].Rows[0]["ABNY_CODE"] = "4Y";
当调用多个异常代码时,用英文逗号分隔开
iblk_lh.Tables[0].Rows[0]["ABNY_CODE"] = "4Y,C1,C2";
doFlag = f_qmbs_yc(&iblk_lh, bcls_ret, conn);
if (doFlag < 0)
{
  Log::Trace("", "", "f_qmts_yc msg = [{0}]", s.msg);
  throw CApplicationException(-1, s.msg, log.Location);
}
**************************************************/

#include "stdafx.h"

BM2_FUNCTION_EXPORT

int f_qmbs_yc_exc(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn);
int f_qmbs_yc_jud(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn); // 炉次异常写TQMTS23表
int f_qmbs_yc(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString sql_abny_code = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CDbCommand cmd(conn);
  CModel tqmbs71("TQMBS71");
  EIClass bcls_exc;
  bcls_exc.Tables[0].Columns.Add(DT_STRING, "ABNY_CODE");
  bcls_exc.Tables[0].Columns.Add(DT_STRING, "REMARK_DES");
  bcls_exc.Tables[0].Columns.Add(DT_STRING, "ATMC");  // 计算符号
  bcls_exc.Tables[0].Columns.Add(DT_STRING, "VALUE"); // 值
  bcls_exc.Tables[0].Columns.Add(DT_STRING, "HEAT_NO");
  bcls_exc.Tables[0].Rows.Add();

  EIClass bcls_abn;
  try
  {
    if (!bcls_rec->Tables[0].Columns.Contains("HEAT_NO"))
    {
      sprintf(s.msg, "未传入熔炼号");
      throw CApplicationException(-1, s.msg, log.Location);
    }
    if (!bcls_rec->Tables[0].Columns.Contains("ABNY_CODE"))
    {
      sprintf(s.msg, "未传入炉次异常代码");
      throw CApplicationException(-1, s.msg, log.Location);
    }
    if (bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString().Trim() == "")
    {
      sprintf(s.msg, "熔炼号为空");
      throw CApplicationException(-1, s.msg, log.Location);
    }
    if (bcls_rec->Tables[0].Rows[0]["ABNY_CODE"].ToString().Trim() == "")
    {
      sprintf(s.msg, "炉次异常代码为空");
      throw CApplicationException(-1, s.msg, log.Location);
    }
    CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString();
    CString abny_code = bcls_rec->Tables[0].Rows[0]["ABNY_CODE"].ToString();
    abny_code = "('" + abny_code.Replace(",", "','") + "')";
    sql_abny_code = " ABNY_CODE IN " + abny_code;
    Log::Trace("", "", "abny_code = {0}", abny_code);
    Log::Trace("", "", "abny_code = {0}", sql_abny_code);
    Log::Trace("", "", "f_qmbs_yc heat_no = {0}", heat_no);
    CString st_no = "";
    CString pono = "";
    // 根据制造命令号查找对应的熔炼号、出钢记号
    sqlstr = "SELECT PONO,ST_NO FROM tpssm41 where heat_no = @heat_no union SELECT HEAT_NO,ST_NO FROM tpssm11 where heat_no = @heat_no";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", heat_no);
    cmd.ExecuteReader();
    if (cmd.Read())
    {
      pono = cmd.GetString(1);
      st_no = cmd.GetString(2);
    }
    else
    {
      return 0;
    }
    // tqmbs71表赋值
    tqmbs71["HEAT_NO"] = heat_no;
    tqmbs71["PONO"] = pono;
    cmd.Close();
    // 出钢记号对应品质异常处理组查询
    sqlstr = "SELECT ABNR_TREAT_GRP  FROM  TQMTS08 WHERE ST_NO= @st_no";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("st_no", st_no);
    cmd.ExecuteReader();
    CString abnr_treat_grp = "";
    if (cmd.Read())
    {
      abnr_treat_grp = cmd.GetString(1);
    }
    cmd.Close();
    // 查询需要执行的SQL语句
    sqlstr = "SELECT ABNY_CODE ,REMARK_DES,ATMC ,VALUE_0 FROM TQMBS73 WHERE  " + sql_abny_code + " ORDER BY ABNY_CODE ASC";
    Log::Trace("", "", "sqlstr = {0}", sqlstr);
    cmd.SetCommandText(sqlstr);
    cmd.ExecuteQuery(bcls_abn.Tables[0]);
    cmd.Close();
    int ret_mul = 1;
    for (size_t i = 0; i < bcls_abn.Tables[0].Rows.get_Count(); i++)
    {
      CString abny_code = bcls_abn.Tables[0].Rows[i]["ABNY_CODE"];
      CString abny_code_aft = bcls_abn.Tables[0].Rows[i]["ABNY_CODE"];
      tqmbs71["ABNY_CODE"] = abny_code;
      tqmbs71.Delete("HEAT_NO,ABNY_CODE");
      Log::Trace("", "", "abny_code = {0}", abny_code);
      if (i < bcls_abn.Tables[0].Rows.get_Count() - 1)
      {
        abny_code_aft = bcls_abn.Tables[0].Rows[i + 1]["ABNY_CODE"];
      }
      else
      {
        abny_code_aft = "";
      }
      bcls_exc.Tables[0].Rows[0]["ABNY_CODE"] = bcls_abn.Tables[0].Rows[i]["ABNY_CODE"];
      bcls_exc.Tables[0].Rows[0]["REMARK_DES"] = bcls_abn.Tables[0].Rows[i]["REMARK_DES"];
      bcls_exc.Tables[0].Rows[0]["ATMC"] = bcls_abn.Tables[0].Rows[i]["ATMC"];
      bcls_exc.Tables[0].Rows[0]["VALUE"] = bcls_abn.Tables[0].Rows[i]["VALUE_0"];
      bcls_exc.Tables[0].Rows[0]["HEAT_NO"] = heat_no;
      int ret_flag = 0;
      if (bcls_exc.Tables[0].Rows[0]["REMARK_DES"].ToString().Substring(0, 1).ToUpper() == "F")
      {
        strcpy(e.func_name[0], bcls_exc.Tables[0].Rows[0]["REMARK_DES"].ToString());
        bcls_rec->SetED(e);
        ret_flag = f_epedcall(bcls_rec, bcls_ret);
      }
      else
      {
        ret_flag = f_qmbs_yc_exc(&bcls_exc, bcls_ret, conn);
      }
      Log::Trace("", "", "ret_flag = {0}", ret_flag);
      ret_mul = ret_mul * ret_flag;
      if (ret_flag < 0)
      {
        Log::Trace("", "", "f_qmts_yc_exc msg = [{0}]", s.msg);
        s.flag = 0;
        doFlag = 0;
      }

      if (abny_code != abny_code_aft) // 异常代码不同则判断是否新增
      {
        Log::Trace("", "", "line = {0}", __LINE__);
        if (ret_mul) // 异常代码条件全部符合，异常代码新增到TQMBS71表
        {
          Log::Trace("", "", "line = {0}", __LINE__);
          tqmbs71["ABNY_CODE"] = abny_code;

          // 查询79表
          sqlstr = "SELECT  ABN_SERS_GRADE,HEAT_GRADE,ST_NO FROM TQMBS79 WHERE  ABNY_CODE = @tqmbs71.ABNY_CODE  AND (ABNR_TREAT_GRP = @tqmts0x.ABNR_TREAT_GRP OR ABNR_TREAT_GRP = 'XX')";
          cmd.SetCommandText(sqlstr);
          cmd.Parameters.Set("tqmbs71.ABNY_CODE", tqmbs71["ABNY_CODE"].ToString());
          cmd.Parameters.Set("tqmts0x.ABNR_TREAT_GRP", abnr_treat_grp);
          cmd.ExecuteReader();
          if (cmd.Read())
          {
            tqmbs71["ABN_SERS_GRADE"] = cmd.GetString(1);
            tqmbs71["HEAT_GRADE"] = cmd.GetString(2);
            tqmbs71["ST_NO"] = cmd.GetString(3);
            if (tqmbs71["HEAT_GRADE"].ToString().Trim() == "")
            {
              tqmbs71["HEAT_GRADE"] = "1";
            }
            else
            {
              tqmbs71["HEAT_GRADE"] = cmd.GetString(2);
            }
          }
          cmd.Close();
          tqmbs71["REC_CREATE_TIME"] = datetime;
          tqmbs71["REC_CREATOR"] = s.userid;
          tqmbs71["SERVER_NAME"] = s.svc_name;
          tqmbs71.Insert();
        }
        ret_mul = 1;
      }
    }
    cmd.Close();
    // 调用炉次异常更新TQMTS23表
    doFlag = f_qmbs_yc_jud(bcls_rec, bcls_ret, conn);
    if (doFlag < 0)
    {
      throw CApplicationException(-1, s.msg, log.Location);
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
