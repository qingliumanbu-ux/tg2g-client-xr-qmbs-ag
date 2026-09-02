<template>
    <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f4-do="F4_DO"
      :f4-pre-do="F4_PRE_DO"
      :f4-cancel="F4_CANCEL">
  
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
  
   <div style="display: flex; flex-direction: column;height: 100%;">
                <xr-ef-panel title="炉次信息"
                  padding="5px">
                  <template #customButtonSlot>
  
                  </template>
                  <template #contentSlot>
                    <!-- :toolbar-options="gridToolbar1" -->
                    <er-grid v-if="initializeFlag === 1"
                      :er-form-helper-prop="erFormHelper"
                      :config-id="'GridView1'"
                      :toolbar-style="'both'"
                      @focus-changed="gridView1FocusChanged"
                      @erGridReady="erGrid1Ready">
                    </er-grid>
                  </template>
                </xr-ef-panel>
              </div>
      <div style="display: flex;height:100%;">
        <xr-ef-panel title="判定结果"
                  padding="5px">
                    <template #customButtonSlot>
  
                  </template>
                   <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView2'"
            :toolbar-style="'both'"
            @focus-changed="gridView2FocusChanged"
            @erGridReady="erGrid2Ready">
          </er-grid>
        </template>
           </xr-ef-panel>
  
           <xr-ef-panel title="成分信息"
                  padding="5px">
                      <template #customButtonSlot>
  
                  </template>
                   <template #contentSlot>
  
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView3'"
            :toolbar-style="'both'"
            @erGridReady="erGrid3Ready">
          </er-grid>
          </template>
     </xr-ef-panel>
      </div>
  
      <div style="display: flex; flex-direction: column;height: 100%;">
                <xr-ef-panel title="材料信息"
                  padding="5px">
                  <template #customButtonSlot>
  
                  </template>
                  <template #contentSlot>
                    <!-- :toolbar-options="gridToolbar1" -->
                    <er-grid v-if="initializeFlag === 1"
                      :er-form-helper-prop="erFormHelper"
                      :config-id="'GridView4'"
                      :toolbar-style="'both'"
                      @erGridReady="erGrid4Ready">
                    </er-grid>
                  </template>
                </xr-ef-panel>
              </div>
  
       <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilter1'"></er-layout>
    </xr-ef-form>
      </div>
  </template>
  
  <script lang="ts"
    src="./QMBS21.ts">
  </script>
  