<!--
 * @Description:
 * @Author: Edward
 * @Date: 2023-10-16 16:35:33
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-11-24 10:39:18
-->
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { computed, onMounted, ref } from "vue";
import { getAntdTheme, changeTheme } from "EFX/theme";

dayjs.locale("zh-cn");
const antdTheme = ref(getAntdTheme());

onMounted(() => {
  changeTheme(undefined, true);
});
if ((window as any).$wujie) {
  (window as any).$wujie.bus?.$on("changeThemeEmit", (e: any) => {
    changeTheme(undefined, true);
    antdTheme.value = getAntdTheme();
  });
}
</script>
<script lang="ts">
import { defineComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";
export default defineComponent({
  name: "App",
  components: {
    "a-config-provider": ConfigProvider,
  },
});
</script>
<template>
  <a-config-provider :theme="antdTheme" :locale="zhCN" component-size="small">
    <router-view></router-view>
  </a-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
