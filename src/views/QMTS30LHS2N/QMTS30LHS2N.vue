<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f5-pre-do="F5_PRE_DO"
      :f5-cancel="F5_CANCEL" :f6-do="F6_DO" :f7-do="F7_DO" :f8-do="F8_DO" :f9-do="F9_DO">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <xr-ef-panel title="炉次待判处置" padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'GridView1'"
            :toolbar-style="'both'" @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <xr-ef-dialog v-model:visible="dialogFormVisible" :title="dialogFormName_title" height="80%" width="80%"
      @click-close-icon="handleClose" :default-footer="false">
      <QMBSCZ :openInDialog="true" :dialogFormName="dialogFormName" :parentInfo="parentInfo"
        @getChildInfo="getChildInfo">
      </QMBSCZ>
    </xr-ef-dialog>
  </div>
</template>
<script lang="ts" src="./QMTS30LHS2N.ts">
</script>
