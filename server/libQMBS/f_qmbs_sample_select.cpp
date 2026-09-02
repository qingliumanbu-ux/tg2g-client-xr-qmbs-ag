/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-09-14 19:54:28
Description: 代表成分优选
跟据多个连铸结果，选择一个最优的
**************************************************/

#include "stdafx.h"
#include "math.h"

BM2_FUNCTION_EXPORT

int f_qmbs_sample_select(EIClass *bcls_rec, EIClass *bcls_ret, CDbConnection *conn)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";
  CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
  CDbCommand cmd(conn);
  EIClass sample_ret;
  bcls_ret->Tables[0].Rows.Add();
  bcls_ret->Tables[0].Columns.Add(DT_STRING, "ST_SAMPLE_NO");
  bcls_ret->Tables[0].Columns.Add(DT_STRING, "HEAT_NO");
  CModel tqmts24("TQMTS24");
  try
  {
    // 查询所有试样
    CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString();
    CString st_sample_no = bcls_rec->Tables[0].Rows[0]["ST_SAMPLE_NO"].ToString();
    if (st_sample_no.Substring(0, 3) != "166" && st_sample_no.Substring(0, 3) != "167")
    {
      Log::Trace("", "", "非连铸样，返回");
      return 0;
    }
    sqlstr = " SELECT * FROM TQMTS24 WHERE HEAT_NO = @heat_no AND SUBSTR(ST_SAMPLE_NO, 1, 3) > 166 AND  SUBSTR(ST_SAMPLE_NO, 1, 3) < 180 AND JUDGE_CODE = '2' ";
    cmd.SetCommandText(sqlstr);
    cmd.Parameters.Set("heat_no", heat_no);
    cmd.ExecuteQuery(sample_ret.Tables[0]);
    cmd.Close();
    if (sample_ret.Tables[0].Rows.get_Count() == 0) //
    {
      return 0;
    }
    if (sample_ret.Tables[0].Rows.get_Count() == 1) //
    {
      bcls_ret->Tables[0].Rows[0]["ST_SAMPLE_NO"] = sample_ret.Tables[0].Rows[0]["ST_SAMPLE_NO"];
      bcls_ret->Tables[0].Rows[0]["HEAT_NO"] = sample_ret.Tables[0].Rows[0]["HEAT_NO"];
      return 0;
    }
    sample_ret.Tables[0].Columns.Add(DT_DECIMAL, "SUM_WEIGHT");
    // 多个合格样，跟据最小值和实绩值差值，与静态表中的权重相乘计算。最小值则为选取的试样
    for (size_t i = 0; i < sample_ret.Tables[0].Rows.get_Count(); i++)
    {
      tqmts24.MergeFrom(sample_ret.Tables[0].Rows[i]);
      sqlstr = " SELECT T1.ELM_ACT, T2.ELM_WEIGHT, T3.MAIN_MIN, T3.MAIN_MAX  FROM TQMTS25 T1"
               "				INNER JOIN  TQMBS01 T2"
               "				ON T1.ELM_CODE = T2.ELM_CODE"
               "				LEFT JOIN TQMTS02 T3"
               "				ON T1.ST_NO = T3.ST_NO AND T1.ELM_CODE = T3.ELM_CODE"
               "				WHERE T1.HEAT_NO = @heat_no AND T1.ST_SAMPLE_NO = @st_sample_no ";
      cmd.SetCommandText(sqlstr);
      cmd.Parameters.Set("heat_no", tqmts24["HEAT_NO"].ToString());
      cmd.Parameters.Set("st_sample_no", tqmts24["ST_SAMPLE_NO"].ToString());
      cmd.ExecuteReader();
      while (cmd.Read())
      {
        CDecimal elm_act = cmd.GetDecimal(1);
        CDecimal elm_weight = cmd.GetDecimal(2);
        CDecimal main_min = cmd.GetDecimal(3);
        CDecimal main_max = cmd.GetDecimal(4);
        CDecimal sum = abs(elm_act.ToDouble() - main_min.ToDouble()) * elm_weight.ToDouble();
        sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"] = sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal() + sum;
      }
      tqmts24["ELM_WEIGHT"] = sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal();
      tqmts24.Update("ELM_WEIGHT");
      cmd.Close();
    }
    // 选权重最小的试样号
    CDecimal sum_weight_min = 0;
    for (size_t i = 0; i < sample_ret.Tables[0].Rows.get_Count(); i++)
    {
      Log::Trace("", "", "st_sample_no = {0}", sample_ret.Tables[0].Rows[i]["ST_SAMPLE_NO"].ToString());
      Log::Trace("", "", "sum_weight = {0}", sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal());
      if (i == 0)
      {
        bcls_ret->Tables[0].Rows[0]["ST_SAMPLE_NO"] = sample_ret.Tables[0].Rows[i]["ST_SAMPLE_NO"];
        bcls_ret->Tables[0].Rows[0]["HEAT_NO"] = sample_ret.Tables[0].Rows[i]["HEAT_NO"];
        sum_weight_min = sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal();
        Log::Trace("", "", "sum_weight_min = {0}", sum_weight_min);
        continue;
      }

      if (sum_weight_min > sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal())
      {
        bcls_ret->Tables[0].Rows[0]["ST_SAMPLE_NO"] = sample_ret.Tables[0].Rows[i]["ST_SAMPLE_NO"];
        sum_weight_min = sample_ret.Tables[0].Rows[i]["SUM_WEIGHT"].ToDecimal();
      }
      Log::Trace("", "", "sum_weight_min = {0}", sum_weight_min);
    }
    Log::Trace("", "", "final st_sample_no = {0}", bcls_ret->Tables[0].Rows[0]["ST_SAMPLE_NO"].ToString());
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
