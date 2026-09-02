/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-07-11 16:05:51
 * @LastEditors: Edward
 * @LastEditTime: 2023-07-11 16:20:35
 */
import { createPinia } from 'pinia';
import { App } from 'vue';
import { useCachedStore } from './modules/cached';
export { useCachedStore } from './modules/cached';
const store = createPinia();
export function useStore() {
  return {
    cached: useCachedStore()
  };
}
export function setupStore(app: App<Element>) {
  app.use(store);
}
