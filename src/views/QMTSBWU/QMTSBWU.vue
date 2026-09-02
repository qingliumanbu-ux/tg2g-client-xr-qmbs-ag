<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO"
      :f6-pre-do="F6_PRE_DO" :f6-cancel="F6_CANCEL" :f7-do="F7_DO" :f7-pre-do="F7_PRE_DO" :f7-cancel="F7_CANCEL">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>

      <!-- 左右结构 -->
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane>
          <xr-ef-panel title="推送消息" padding="5px" style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main'"
                @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane>
          <!-- 上下分割 -->
          <v-splitter horizontal style="height: 100%" class="default-theme">
            <v-splitter-pane size="50">
              <xr-ef-panel title="消息通知人维护" padding="5px" style="height: 100%">
                <template #customButtonSlot>

                </template>
                <template #contentSlot>
                  <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main2'"
                    :toolbar-style="'both'" @erGridReady="erGrid3Ready">
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
            <v-splitter-pane size="50">
              <xr-ef-panel title="推送消息履历" padding="5px" style="height: 100%">
                <template #customButtonSlot>

                </template>
                <template #contentSlot>
                  <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView_main1'"
                    @erGridReady="erGrid2Ready">
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>

      </v-splitter>
    </xr-ef-form>


  </div>
</template>

<script lang="ts" src="./QMTSBWU.ts">
</script>
