<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f3-pre-do="F3_PRE_DO" :f3-cancel="F3_CANCEL">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel
        title="工艺卡违规-------导入注意事项：违规类型和违规级别只能是固定选项，列不能增删改。违规类型：主观性违规，工序保进违规，客观操作违规；违规级别：A,B,C 禁令，红线；责任单位：各单位简称"
        padding="5px" style="height: 100%">
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./QMTSWGS2N.ts">
</script>
