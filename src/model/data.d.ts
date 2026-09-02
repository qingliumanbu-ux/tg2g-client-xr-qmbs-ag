/*
 * @Description: 类型定义
 * @Author: Edward
 * @Date: 2023-03-07 13:26:10
 * @LastEditors: Edward
 * @LastEditTime: 2023-08-25 14:02:46
 */
export interface IForm {
  formName: string;
  formCaption: string;
  formPartition: string;
  appName: string;
  dllName: string;
  formPath: string;
  formCallMode: string;
}

export interface IFormParamsInfo {
  baseFormName: string;
  params: { [key: string]: any };
}

export interface IFormParams {
  [key: string]: any;
}

// 数据库字段
export interface IFormInfo {
  NAME: string;
  DESCRIPTION: string;
  DLLNAME: string;
  ACLID: string;
  ABBREV: string;
  ICONNUM: number;
  FORM_CALL_MODE: string;
  APPNAME: string;
  DLLPATH: string;
}
export interface IForm {
  formName: string;
  formCaption: string;
  formPartition: string;
  appName: string;
  dllName: string;
  formPath: string;
  formCallMode: string;
}

export interface IFormParamDataInfo {
  FORM_NAME: string;
  FORM_BASE_NAME: string;
  PK1_NAME: string;
  PK1: string;
  PK2_NAME: string;
  PK2: string;
  PK3_NAME: string;
  PK3: string;
  PK4_NAME: string;
  PK4: string;
  PK5_NAME: string;
  PK5: string;
  PK6_NAME: string;
  PK6: string;
  PK7_NAME: string;
  PK7: string;
  PK8_NAME: string;
  PK8: string;
  PK9_NAME: string;
  PK9: string;
  PK10_NAME: string;
  PK10: string;
}
export interface AuthFormInfo {
  NAME: string;
  DESCRIPTION: string;
  SHORTCUT: string;
  CNT: string;
  APPNAME: string;
  ABBREV: string;
  FORM_CALL_MODE: string;
  DLLPATH: string;
  DLLNAME: string;
  FORM_BASE_NAME: string;
  PK1_NAME: string;
  PK1: string;
  PK2_NAME: string;
  PK2: string;
  PK3_NAME: string;
  PK3: string;
  PK4_NAME: string;
  PK4: string;
  PK5_NAME: string;
  PK5: string;
  PK6_NAME: string;
  PK6: string;
  PK7_NAME: string;
  PK7: string;
  PK8_NAME: string;
  PK8: string;
  PK9_NAME: string;
  PK9: string;
  PK10_NAME: string;
  PK10: string;
}

export interface IAuthButton {
  name: string;
  desc: string;
  opType: string;
  icon?: string;
  regionId?: string;
  isAuth?: string;
}
