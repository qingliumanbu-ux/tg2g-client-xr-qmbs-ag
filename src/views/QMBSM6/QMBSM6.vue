<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="材料信息" padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>

      <xr-ef-panel title="委托信息" padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main1'"
            @erGridReady="erGrid2Ready">
          </er-grid>
        </template>
      </xr-ef-panel>

    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./QMBSM6.ts">
</script>
