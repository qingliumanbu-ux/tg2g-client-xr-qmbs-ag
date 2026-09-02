<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO"
      :f7-do="F7_DO">
      <!-- 上下分割 -->
      <v-splitter horizontal style="height: 100%" class="default-theme">
        <v-splitter-pane size="50">
          <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
            :config-id="'LayoutGroupFilter'"></er-layout>
          <a-tabs v-model:activeKey="tab1ActiveKey" type="card" @change="handleTabChange">
            <a-tab-pane key="tab1" tab="物料信息" forceRender='true' style="overflow: auto; height: 75%; padding:5px">
              <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_Jain'"
                :page-options="{ pagination: 'server', pageSize: 100 }" @erGridReady="erGrid1Ready">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="低倍信息" forceRender='true' style="overflow: auto; height: 75%; padding:5px">
              <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main'"
                :page-options="{ pagination: 'server', pageSize: 100 }" @erGridReady="erGrid2Ready"
                @focus-changed="gridView_main_focuse_changed">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </v-splitter-pane>
        <v-splitter-pane size="50" style="overflow: auto;">
          <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_single'"
            :show-query-button="false"></er-layout>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
    <Dibei :dialogFormVisible="dialogFormVisible" @formSubmitted="handleFormSubmitted" @handleClose="handleClose"
      :formData="formData">
    </Dibei>
    <DiBei_NQ class="Box" :dialogFormVisible="dialogFormVisible1" @formSubmitted="handleFormSubmitted"
      @handleClose="handleClose" :formData="formData">
    </DiBei_NQ>
  </div>
</template>

<script lang="ts" src="./QMBSM2.ts">
</script>
<style lang="scss" scoped>
@import "./QMBSM2.scss";
</style>
