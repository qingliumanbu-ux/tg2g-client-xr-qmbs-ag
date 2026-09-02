<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
      ></er-layout>
      <xr-ef-panel title="查询内容" padding="5px" style="height: 100%">
        <template #contentSlot>
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView_main'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <ShangQ
      :dialogFormVisible="dialogFormVisible"
      @formSubmitted="handleFormSubmitted"
      @handleClose="handleClose"
      :formData="formData"
    >
    </ShangQ>
    <ShangQDR
      :dialogFormVisible="dialogFormVisibleDR"
      @formSubmitted="handleFormSubmitted"
      @handleClose="handleCloseDR"
      :formData="formData"
    >
    </ShangQDR>
  </div>
</template>

<script lang="ts" src="./QMTSSQS2N.ts"></script>
