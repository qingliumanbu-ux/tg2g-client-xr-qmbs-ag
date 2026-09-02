/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-10-16 16:35:33
 * @LastEditors: Edward
 * @LastEditTime: 2024-01-15 08:33:29
 */

/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    // 是否存在无界
    __POWERED_BY_WUJIE__?: boolean;
    // 子应用mount函数
    __WUJIE_MOUNT: () => void;
    // 子应用unmount函数
    __WUJIE_UNMOUNT: () => void;
    // 子应用无界实例
    __WUJIE: { mount: () => void };
  }
}

declare module "EIX" {
  export * from '#/@mf-types/EIX'
}
declare module "EFX" {
  export * from "#/@mf-types/EFX";
}
declare module "ERX" {
  export * from "#/@mf-types/ERX";
}
declare module "EPTF" {
  export * from "#/@mf-types/EPTF";
}
declare module "splitpanes";
// declare module '@module-federation/native-federation-typescript/*';
// declare module '@module-federation/native-federation-tests/*';
