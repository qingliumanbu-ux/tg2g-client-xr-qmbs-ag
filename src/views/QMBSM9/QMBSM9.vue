<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO">
      <!-- 上下分割 -->
      <v-splitter horizontal style="height: 100%" class="default-theme">
        <v-splitter-pane size="50">
          <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
            :config-id="'LayoutGroupFilter'"></er-layout>
          <xr-ef-panel title="制造标准信息" padding="5px" style="height: 80%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
                   <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :toolbar-options="gridToolbar"
                :toolbar-style="'both'" :config-id="'GridView1'"
                @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="50">
          <a-tabs v-model:activeKey="tab1ActiveKey" type="card" @change="handleTabChange">
            <a-tab-pane key="tab1" tab="制造标准信息" forceRender='true' style="overflow: auto; height: 100%; padding:5px">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                :config-id="'LayoutGroupFilter1'" :show-query-button="false">
              </er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="成分信息" forceRender='true'>
              <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'GridView2'"
                @erGridReady="erGrid2Ready">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./QMBSM9.ts"></script>
