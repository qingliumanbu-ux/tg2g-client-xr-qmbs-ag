<!--
 * @Description:
 * @Author: PANCHEN
 * @Date: 2023-10-20 11:04:08
 * @LastEditors: PANCHEN
 * @LastEditTime: 2023-10-20 13:57:18
-->
<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f7-do="F7_DO">
    <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilter'"></er-layout>
    <xr-ef-panel title="数据区" padding="5px">
      <template #customButtonSlot>

      </template>
      <template #contentSlot>
        <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main'"
           @erGridReady="erGrid1Ready" :toolbar-style="'both'">
        </er-grid>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>


<script lang="ts" src="./QMBSM1.ts"></script>
<style lang="scss" scoped>
</style>
