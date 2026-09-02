<!--
 * @Description:
 * @Author: Edward
 * @Date: 2023-03-06 10:30:23
 * @LastEditors: Edward
 * @LastEditTime: 2023-03-08 11:13:45
-->
<template>
  <Result status="404" title="404" subtitle="您访问的页面不存在。">
    <template #extra>
    </template>
  </Result>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Result from '@/components/Result/index.vue';
export default defineComponent({
  name: 'NotFound',
  components: {
    Result
  }
});
</script>
