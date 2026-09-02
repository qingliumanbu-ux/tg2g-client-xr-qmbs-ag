/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-07-11 16:06:24
 * @LastEditors: B00525
 * @LastEditTime: 2023-08-01 19:49:10
 */
import { defineStore } from 'pinia';
interface CachedRouteInfo {
  name: string;
  forms: Set<string>;
}
export interface CachedState {
  cachedList: Map<string, Set<string>>;
  cachedViews: any[];
}

export const useCachedStore = defineStore('cached', {
  state: (): CachedState => ({
    cachedList: new Map<string, Set<string>>(),
    cachedViews: []
  }),
  getters: {
    getCachedList(state) {
      // const keys = state.cachedList.keys();
      return Array.from(state.cachedList, ([name, value]) => name);
    },
    getCachedViews(state) {
      return state.cachedViews;
    }
  },
  actions: {
    async addCached({ name, baseName }: { name: string; baseName: string }) {
      if (this.cachedList.has(baseName)) {
        const cachedRoute = this.cachedList.get(baseName);
        if (cachedRoute) {
          cachedRoute.add(name);
        }
      } else {
        this.cachedList.set(baseName, new Set([name]));
      }
    },
    async removeCached({ name, baseName }: { name: string; baseName: string }) {
      // this.cachedList.delete(name);
      if (this.cachedList.has(baseName)) {
        const cachedRoute = this.cachedList.get(baseName);
        if (cachedRoute) {
          cachedRoute.delete(name);
          if (cachedRoute.size === 0) {
            this.cachedList.delete(baseName);
          }
        }
      }
    },
    async setCachedViews(views: any[]) {
      this.cachedViews = views;
    }
  }
});
