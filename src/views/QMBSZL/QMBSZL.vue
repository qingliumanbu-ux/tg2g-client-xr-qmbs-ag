<!--
 * @Description:
 * @Author: Edward
 * @Date: 2022-04-28 11:04:08
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 14:43:52
-->
<template>
  <div style="height: 100%">
    <xr-ef-form :in-dialog-form-name="openInDialog ? dialogFormName : 'null'" @ready="efFormReady"
      @closeDialog="closeEfDialog" :f2-do="F2_DO">
      <template v-if="initializeFlag === 1">
        <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'QMTS30_DIALOG1'"
          :config-caption="title_top">
        </er-layout>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
        </el-dialog>
        <el-upload ref="upload" action="http://10.162.72.16:10004/ChuZhi" list-type="picture-card" :auto-upload="false"
          :before-upload="beforeAvatarUpload" class="upload-format" :limit="5" v-model:file-list="fileList"
          :multiple="true" style="display: flex; place-content: center; height: 200px">
          <el-icon>
            <Plus />
          </el-icon>
          <template #tip>
            <div class="el-upload__tip"></div>
          </template>

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon>
                    <ZoomIn />
                  </el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <el-icon>
                    <Download />
                  </el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload></template>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./QMBSZL"></script>

<style lang="scss" scoped>
@import "./QMBSZL.scss";
</style>
