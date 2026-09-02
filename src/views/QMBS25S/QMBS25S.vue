<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="f2Do" :f3-pre-do="f3PreDo" :f3-do="f3Do" :f3-cancel="f3Cancel"
      :f4-pre-do="f4PreDo" :f4-do="f4Do" :f4-cancel="f4Cancel" :f5-pre-do="f5PreDo" :f5-do="f5Do" :f5-cancel="f5Cancel"
      :f6-do="f6Do" :f11-do="f11Do" :f12-do="f12Do">

      <!-- 左右结构 -->
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane>
          <!-- 上下分割 -->
          <v-splitter horizontal style="height: 100%" class="default-theme">

            <v-splitter-pane size="50">
              <div style="display: flex; flex-direction: column; height: 100%;">
                <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'" :show-query-button="false"></er-layout>
                <xr-ef-panel title="炉次信息" padding="5px">
                  <template #contentSlot>
                    <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView1'"
                      :toolbar-style="'both'" :page-options="{ pagination: 'server', pageSize: 100 }"
                      @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged">
                    </er-grid>
                  </template>
                </xr-ef-panel>
              </div>
            </v-splitter-pane>
            <v-splitter-pane size="50">
              <div style="display: flex; flex-direction: column; height: 100%;">
                <xr-ef-panel title="工序及试样信息" padding="5px">
                  <template #contentSlot>
                    <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView2'"
                      :toolbar-style="'both'" @erGridReady="erGrid2Ready" @focus-changed="gridView2FocusChanged">
                    </er-grid>
                  </template>
                </xr-ef-panel>
              </div>
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>
        <v-splitter-pane>
          <v-splitter horizontal style="height: 100%" class="default-theme">
            <v-splitter-pane size="12">
              <div style="display: flex; flex-direction: column; height: 100%;">
                <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter1'" :show-query-button="false"></er-layout>
              </div>
            </v-splitter-pane>

            <v-splitter-pane size="90">
              <div style="display: flex; flex-direction: column; height: 100%;">
                <xr-ef-panel title="试样成分信息" padding="5px">
                  <template #contentSlot>
                    <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :toolbar-style="'both'"
                      :config-id="'gridView3'" @erGridReady="erGrid3Ready">
                    </er-grid>
                  </template>
                </xr-ef-panel>
              </div>
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./QMBS25S.ts">
</script>

<style lang="scss">
@import './QMBS25S.scss';
</style>
