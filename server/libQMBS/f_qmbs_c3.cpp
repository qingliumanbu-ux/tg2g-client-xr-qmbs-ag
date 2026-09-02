/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2023-07-07 19:54:28
Description: EPEDCALL调用函数模板 --炉次异常73判定
**************************************************/

#include "stdafx.h"

extern "C" BM2_FUNCTION_EXPORT
int f_qmbs_c3(EIClass * bcls_rec, EIClass * bcls_ret, CDbConnection * conn)
{
	CTracer log(__FUNCTION__);
	int doFlag = 0;
	CString sqlstr = " ";
	CString datetime = CDateTime::Now().ToString("yyyyMMddHHmmss");
	CDbCommand cmd(conn);
	try
	{
		CString heat_no = bcls_rec->Tables[0].Rows[0]["HEAT_NO"].ToString();
		CString plan_refine_route_code = "";
		CString refine_route_code = "";
		CString st_no = "";
		int v_route_ok_flag = 0;
		//查询实绩精炼路径
		sqlstr = "SELECT REFINE_ROUTE_CODE,ST_NO  FROM tpssm11 WHERE HEAT_NO = @heat_no ";
		cmd.SetCommandText(sqlstr);
		cmd.Parameters.Set("heat_no", heat_no);
		cmd.ExecuteReader();
		if (cmd.Read())
		{
			refine_route_code = cmd.GetString(1);
			st_no = cmd.GetString(2);
		}
		cmd.Close();
		//查询质量要求精炼路径
		sqlstr = "SELECT REFINE_ROUTE_CODE FROM TQMTS0X WHERE ST_NO = @st_no ";
		cmd.SetCommandText(sqlstr);
		cmd.Parameters.Set("st_no", st_no);
		cmd.ExecuteReader();
		if (cmd.Read())
		{
			plan_refine_route_code = cmd.GetString(1);
		}
		cmd.Close();
		if (plan_refine_route_code == "A000")//只过吹氩站
		{
			v_route_ok_flag = 0;
		}
		else if (plan_refine_route_code == "AL00" || plan_refine_route_code == "L000")//过吹氩和LF炉
		{
			//实际精炼路径中不包含L或者R则不满足要求
			if (refine_route_code.Find("L") >= 0 && refine_route_code.Find("R") >= 0)
			{
				v_route_ok_flag = 1;
			}
		}
		else if (plan_refine_route_code == "AR00" || plan_refine_route_code == "R000")////过吹氩和RH
		{
			//实际精炼路径中不包含R则不满足要求
			if (refine_route_code.Find("R") >= 0)
			{
				v_route_ok_flag = 1;
			}
		}
		else if (strcmp(plan_refine_route_code, "LR00") == 0 || strcmp(plan_refine_route_code, "RL00") == 0)//过LF炉和RH
		{
			//实际精炼路径中不包含L或者R则不满足要求
			if (refine_route_code.Find("L") >= 0 && refine_route_code.Find("R") >= 0)
			{
				v_route_ok_flag = 1;
			}
		}
		return v_route_ok_flag;
	}
	catch (CDbException& ex)
	{
		CFormattable arguments[] = { ex.GetCode(), ex.GetMsg() };
		CMessageFormat::Format(s.msg, "Database Error,sqlcode=[{0}],sqlmsg=[{1}]", arguments, 2);
		CString str = sqlstr + "\r\n" + ex.GetMsg();
		strncpy(s.sysmsg, (const char*)str, sizeof(s.sysmsg) - 1);
		s.flag = -1;
		doFlag = -1;
	}
	catch (CApplicationException& ex)
	{
		s.flag = ex.GetCode();
		doFlag = -1;
	}
	catch (CException& ex)
	{
		strcpy(s.msg, ex.GetMsg());
		s.flag = ex.GetCode();
		doFlag = -1;
	}
	return doFlag;
}


