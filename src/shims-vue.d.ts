/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-03-20 21:07:51
 * @LastEditors: Edward
 * @LastEditTime: 2023-07-05 10:32:28
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.gif' {
  export const gif: any;
}
declare module '*.svg' {
  import Vue, { VueConstructor } from 'vue';
  const content: VueConstructor<Vue>;
  export default content;
}
declare let __webpack_public_path__;

interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  __CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__?: any;
}

/**
 * 添加kendo.jQuery 方法声明，防止eslint报错
 */
declare namespace kendo {
  function jQuery(selector: any, content?: any);
}
