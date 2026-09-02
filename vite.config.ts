/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-10-16 16:35:33
 * @LastEditors: Edward
 * @LastEditTime: 2024-01-15 08:38:48
 */
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import topLevelAwait from "vite-plugin-top-level-await";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { toIsoString } from "./build/utils";
import VitePluginHtmlEnv from 'vite-plugin-html-env';
// https://vitejs.dev/config/
export default (configEnv: ConfigEnv) => {
  const { mode } = configEnv;
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv;
  const {
    VITE_APP_NAME: appName,
    VITE_APP_BASE_API: baseApi,
    VITE_APP_PUBLIC_PATH: publicPath,
  } = viteEnv;
  const __DEV__ = mode === "development";
  return defineConfig({
    define: {
      //viteEnv
      "process.env": {
        ...viteEnv,
        BUILD_TIMESTAMP: `${toIsoString(new Date())}`,
      },
    },
    base: __DEV__ ? "/" : `./`,
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        "@": resolve(__dirname, "./src"),
        "#": resolve(__dirname),
        public: resolve(__dirname, "./public"),
        util: "rollup-plugin-node-polyfills/polyfills/util",
        buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
        process: "rollup-plugin-node-polyfills/polyfills/process-es6",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          // @ts-ignore
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          // @ts-ignore
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    plugins: [
      vue(),
      VitePluginHtmlEnv({
        compiler: true
        // compiler: false // 旧版本
      }),
      federation({
        name: `${appName}_general`,
        filename: "remoteEntry.js",
        remotes: {
          EFX: __DEV__
            ? `${baseApi}remote_exposes/EFX/assets/remoteEntry.js`
            : {
              external: `Promise.resolve(
                  window.top._APP_OPTIONS_  ?
                  window.top._APP_OPTIONS_.appContext + 'remote_exposes/EFX/assets/remoteEntry.js'
                    : '/remote_exposes/EFX/assets/remoteEntry.js'
                  )`,
              externalType: "promise",
            },
          EIX: __DEV__
            ? `${baseApi}remote_exposes/EIX/assets/remoteEntry.js`
            : {
              external: `Promise.resolve(
                window.top._APP_OPTIONS_  ?
                window.top._APP_OPTIONS_.appContext + 'remote_exposes/EIX/assets/remoteEntry.js'
                  : '/remote_exposes/EIX/assets/remoteEntry.js'
                )`,
              externalType: "promise",
            },

          ERX: __DEV__
            ? `${baseApi}remote_exposes/ERX/assets/remoteEntry.js`
            : {
              external: `Promise.resolve(
              window.top._APP_OPTIONS_  ?
              window.top._APP_OPTIONS_.appContext + 'remote_exposes/ERX/assets/remoteEntry.js'
                : '/remote_exposes/ERX/assets/remoteEntry.js'
              )`,
              externalType: "promise",
            },
          EPTF: __DEV__ ? `${baseApi}remote_exposes/EPTF/assets/remoteEntry.js`
            : {
              external: `Promise.resolve(
              window.top._APP_OPTIONS_  ?
              window.top._APP_OPTIONS_.appContext + 'remote_exposes/EPTF/assets/remoteEntry.js'
                : '/remote_exposes/EPTF/assets/remoteEntry.js'
              )`,
              externalType: "promise",
            },
        },
        shared: ["vue"],
      }),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: "__tla",
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`,
      }),
      visualizer({
        template: "treemap", // or sunburst
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "./dist/analyse.html", // will be saved in project's root
      }),
      viteCompression({
        threshold: 1024000, // 对大于 1mb 的文件进行压缩
      }),
    ],
    server: {
      proxy: {
        // 使用正则表达式匹配 URL
        "^/.*/api": {
          target: baseApi,
          changeOrigin: true,
        },
        "/EX": {
          target: baseApi,
          changeOrigin: true,
        },
        "/refreshToken": {
          target: baseApi,
          changeOrigin: true,
        },
        "/remote_exposes": {
          target: baseApi,
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_24": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_25": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_26": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_27": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_28": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
        "/tgjy/service/S_SC_29": {
          target: "http://eplat.tisco.com.cn",
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "esnext",
      outDir: `./dist/${appName}`,
      sourcemap: false,
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // @ts-ignore
          rollupNodePolyFill(),
        ],
      },
    },
  });
};
