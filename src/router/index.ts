/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-10-17 15:48:42
 * @LastEditors: Edward
 * @LastEditTime: 2023-10-19 09:53:31
 */
import { RouteRecordNormalized, RouteRecordRaw } from "vue-router";

const viewsList = import.meta.glob('@/views/**/*.vue', {import: 'default', eager: true})
// const views = require.context('../views', true, /\/.*\.vue$/);
const dynamicRoutes: Array<RouteRecordRaw> = [];
// 遍历文件名字
Object.keys(viewsList).forEach((key) => {
  const statIndex = key.indexOf('/', 5);
  const endIndex = key.lastIndexOf('/');
  const name = key.substring(statIndex + 1, endIndex);
  let route: any = {};
  const appName = import.meta.env.VITE_APP_NAME;
  if (appName && name !== '404' && name !== 'dashboard') {
    route = {
      name: name,
      path: `/${name}`,
      component: () => import(`@/views/${name}/${name}.vue`) //懒加载的！
    };
    dynamicRoutes.push(route);
  }
});


const basicRoutes: Array<RouteRecordRaw> = [
   {
    name: 'dashboard',
    path: '/',
    component: () => import('@/views/dashboard/index.vue')
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue')
  }
];
const routes = dynamicRoutes.concat(basicRoutes);
export default routes;
