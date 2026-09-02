/*************************************************
Copyright: Baosight Software LTD.co Copyright (c) 2021
Author:      潘陈
Version:     1.0
Date:        2021-04-01 19:54:28
Description: 分割函数内部实现
**************************************************/

#include "stdafx.h"
#include <vector>

BM2_FUNCTION_EXPORT

vector<string> f_qmbs_split(const string &dest, vector<string> &c)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";

  try
  {
    vector<string> v;
    vector<string>::iterator iter;
    string s1 = "";
    string s2 = "";
    int pos = 0;
    int j = 0;
    for (int i = 0; i < dest.length(); i++)
    {
      for (j = 0; j < c.size(); j++)
      {
        if (s1 != "")
        {
          if (s1.length() >= c[j].length())
          {
            if (s1.substr(s1.length() - c[j].length(), c[j].length()) == c[j]) // 截出的数据相等
            {
              s2 = s1.substr(0, s1.length() - c[j].length());
              if (s2 != "")
              {
                v.push_back(s2);
              }
              s1 = "";
            }
          }
        }
      }
      if (j == c.size())
      {
        s1 += dest[i];
      }
    }
    if (s1 != "") // 最后一次循环如果 s1中有数据，也需要校验并插入vector中
    {
      for (j = 0; j < c.size(); j++)
      {
        if (s1.length() >= c[j].length())
        {
          if (s1.substr(s1.length() - c[j].length(), c[j].length()) == c[j]) // 截出的数据相等
          {
            s2 = s1.substr(0, s1.length() - c[j].length());
            if (s2 != "")
            {
              v.push_back(s2);
              break;
            }
            s1 = "";
          }
        }
      }
      if (j == c.size() && s1 != "")
      {
        v.push_back(s1);
      }
    }
    return v;
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
  // return doFlag;
}

vector<CString> f_qmts_split(const CString &dest, vector<CString> &c)
{
  CTracer log(__FUNCTION__);
  int doFlag = 0;
  CString sqlstr = " ";

  try
  {
    vector<CString> v;
    vector<CString>::iterator iter;
    CString s1 = "";
    CString s2 = "";
    int pos = 0;
    int j = 0;
    for (int i = 0; i < dest.GetLength(); i++)
    {
      for (j = 0; j < c.size(); j++)
      {
        if (s1 != "")
        {
          if (s1.GetLength() >= c[j].GetLength())
          {
            if (s1.SubstringNE(s1.GetLength() - c[j].GetLength(), c[j].GetLength()) == c[j]) // 截出的数据相等
            {
              s2 = s1.SubstringNE(0, s1.GetLength() - c[j].GetLength());
              if (s2 != "")
              {
                v.push_back(s2);
              }
              s1 = "";
            }
          }
        }
      }
      if (j == c.size())
      {
        s1 += dest[i];
      }
    }
    if (s1 != "") // 最后一次循环如果 s1中有数据，也需要校验并插入vector中
    {
      for (j = 0; j < c.size(); j++)
      {
        if (s1.GetLength() >= c[j].GetLength())
        {
          if (s1.SubstringNE(s1.GetLength() - c[j].GetLength(), c[j].GetLength()) == c[j]) // 截出的数据相等
          {
            s2 = s1.SubstringNE(0, s1.GetLength() - c[j].GetLength());
            if (s2 != "")
            {
              v.push_back(s2);
              break;
            }
            s1 = "";
          }
        }
      }
      if (j == c.size() && s1 != "")
      {
        v.push_back(s1);
      }
    }
    return v;
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
  // return doFlag;
}
