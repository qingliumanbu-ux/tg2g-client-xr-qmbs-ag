/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-03-08 11:28:06
 * @LastEditors: Edward
 * @LastEditTime: 2023-03-03 15:55:27
 */
const { defineConfig } = require('@vue/cli-service');
const { resolve } = require('path');
const toIsoString = (date) => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      return (num < 10 ? '0' : '') + num;
    };

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};
const version = toIsoString(new Date());
// 应用标识
const name = process.env.VUE_APP_NAME;
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? `/child/${name}/` : '/',
  productionSourceMap: false,
  outputDir: `dist/${name}`,
  assetsDir: 'static',
  lintOnSave: true,
  transpileDependencies: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '*': resolve(''),
        Assets: resolve('src/assets')
      } //,
      // extensions: ['', '.js', 'min.js'],
      // root: [
      //   path.resolve('.'),
      //   path.resolve('../kendo/dist/js/') // the path to the minified scripts
      // ]
    },
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd' // 把微应用打包成 umd 库格式
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
    }
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementPlus: {
          name: 'chunk-element-plus',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
        }
      }
    });
    // 添加自定义环境变量
    config.plugin('define').tap((args) => {
      args[0]['process.env'] = {
        ...args[0]['process.env'],
        version: JSON.stringify(version)
      };
      return args;
    });
  }
});
