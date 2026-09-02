/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EI } from './ei';
import { IEnvironment, IUserInfo } from './model';
import { ValueType } from './type';
/**
 * 获取本地Token
 * @returns string | null
 */
export declare const getToken: (rememberMe?: boolean) => string | null;
/**
 * 设置存储本地Token
 * @param token
 * @returns boolean
 */
export declare const setToken: (token: string, rememberMe?: boolean) => boolean;
/**
 * 移除本地Token
 * @returns boolean
 */
export declare const removeToken: () => boolean;
/**
 * 获取本地refresh_token
 * @returns string | null
 */
export declare const getRefreshToken: (rememberMe?: boolean) => string | null;
/**
 * 设置存储本地refresh_token
 * @param refresh_token
 * @returns boolean
 */
export declare const setRefreshToken: (refreshToken: string, rememberMe?: boolean) => boolean;
/**
 * 移除本地refresh_token
 * @returns boolean
 */
export declare const removeRefreshToken: () => boolean;
/**
 * 获取本地remember_me
 * @returns string | null
 */
export declare const getRememberMe: () => boolean;
/**
 * 设置存储本地remember_me
 * @param remember_me
 * @returns boolean
 */
export declare const setRememberMe: (rememberMe: boolean) => boolean;
/**
 * 移除本地remember_me
 * @returns boolean
 */
export declare const removeRememberMe: () => boolean;
/**
 * 获取本地登录用户信息
 * @returns IUserInfo
 */
export declare const getCurrentUser: (rememberMe?: boolean) => IUserInfo;
/**
 * 设置本地登录用户信息
 * @param IUserInfo
 * @returns boolean
 */
export declare const setCurrentUser: (user: IUserInfo, rememberMe?: boolean) => boolean;
/**
 * 移除本地登录用户信息
 * @returns boolean
 */
export declare const removeCurrentUser: () => boolean;
export declare const getCurrentEnvironment: (rememberMe?: boolean) => IEnvironment;
export declare const setCurrentEnvironment: (currentEnvironmentInfo: IEnvironment, rememberMe?: boolean) => boolean;
export declare const removeCurrentEnvironment: () => boolean;
/**
 * 根据ArrayObject 或 Object 快速构建单表多行或单表单行的EIInfo
 * @param data ArrayObject | Object
 * @param tableName 可选参数：表名，不传则动态构建表名Table1
 * @returns EI.EIInfo
 */
export declare const buildEIInfo: (data: {
    [key: string]: ValueType;
} | {
    [key: string]: ValueType;
}[], tableName?: string) => EI.EIInfo;
/**
 * 更新EIInfo，给Context添加当前登录用户信息
 * @param eiinfo
 * @returns eiinfo
 */
export declare const setContext: (eiinfo: EI.EIInfo) => EI.EIInfo;
export declare const loading: (toggle: boolean, timeout: {
    value: NodeJS.Timeout | undefined;
}, element?: any, showAnimation?: boolean, ms?: number) => void;
export declare const isJsonString: (jsonStr: string) => boolean;
export declare const isHtmlString: (htmlStr: string) => boolean;
export declare const getHtmlTagContent: (htmlStr: string) => string[];
export declare const PLAT_TYPE: "4C" | "4J";
export declare const isPlatJ: () => boolean;
export declare const MASTER_EP_NAME: string;
export declare const EP_NAME: string;
export declare const base64Encode: (arrayBuffer: ArrayBuffer) => string;
export declare const base64Decode: (base64String: string) => Buffer;
export declare const toIsoString: (date: Date) => string;
