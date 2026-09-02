<template>


  <el-dialog :model-value="dialogFormVisible" :before-close="beforeClose" title="低倍硫印" width="1500"
    class="dialog-format">

    <el-upload ref="upload" action="http://10.162.72.16:10004/DiBei" list-type="picture-card" :auto-upload="false"
      :before-upload="beforeAvatarUpload" class="upload-format" :limit="1" v-model:file-list="fileList"
      style="display: flex;justify-content: center;align-content: center;height: 200px;">
      <el-icon>
        <Plus />
      </el-icon>
      <template #tip>
        <div class="el-upload__tip">

        </div>
      </template>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon><zoom-in /></el-icon>
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
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
    </el-dialog>
    <el-form :inline="true" :model="formInline" label-width="auto" class="demo-form-inline">
      <el-form-item label="炉号">
        <el-input v-model="formInline.heat_no" placeholder="Approved by" />
      </el-form-item>
      <el-form-item label="钢种">
        <el-input v-model="formInline.st_no" />
      </el-form-item>
      <el-form-item label="坯号">
        <el-input v-model="formInline.mat_no" />
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="formInline.mat_thick" />
      </el-form-item>

      <el-form-item label="中心偏析与疏松">
        <el-input v-model="formInline.center_sgrg_porosity" />
      </el-form-item>
      <el-form-item label="中心裂纹">
        <el-input v-model="formInline.crack_center" />
      </el-form-item>
      <el-form-item label="等轴晶宽度">
        <el-input v-model="formInline.equiaxed_grain_width" />
      </el-form-item>
      <el-form-item label="三角区裂纹级别">
        <el-input v-model="formInline.tri_crack_grade" />
      </el-form-item>

      <el-form-item label="角裂级别">
        <el-input v-model="formInline.angle_crack_grade" />
      </el-form-item>
      <el-form-item label="横向内裂">
        <el-input v-model="formInline.transverse_internal_crack" />
      </el-form-item>
      <el-form-item label="纵向内裂">
        <el-input v-model="formInline.longitudinal_internal_crack" />
      </el-form-item>
      <el-form-item label="其他缺陷描述">
        <el-input v-model="formInline.other_defects_description" />
      </el-form-item>

      <el-form-item label="裂纹">
        <el-input v-model="formInline.crack" />
      </el-form-item>
      <el-form-item label="内弧宽度">
        <el-input v-model="formInline.inner_arc_width" />
      </el-form-item>
      <el-form-item label="外弧宽度">
        <el-input v-model="formInline.outter_arc_width" />
      </el-form-item>
      <el-form-item label="中心厚度（两点）">
        <el-input v-model="formInline.centre_thickness" />
      </el-form-item>

      <el-form-item label="边部厚度（两点）">
        <el-input v-model="formInline.edge_thickness" />
      </el-form-item>

      <el-form-item label="参考标准">
        <el-input v-model="formInline.reference_standard" />
      </el-form-item>
      <el-form-item label="审核责任者">
        <el-input v-model="formInline.check_maker" />
      </el-form-item>
      <el-form-item label="试验过程">
        <el-input v-model="formInline.test_procedure" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleConfirm()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import axios from 'axios';


const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const formInline = reactive({
  heat_no: '',
  st_no: '',
  mat_no: '',
  mat_thick: '',
  center_sgrg_porosity: '',
  crack_center: '',
  equiaxed_grain_width: '',
  equiaxed_grain_percentage: '',
  tri_crack_grade: '',
  angle_crack_grade: '',
  transverse_internal_crack: '',
  longitudinal_internal_crack: '',
  other_defects_description: '',
  crack: '',
  inner_arc_width: '',
  outter_arc_width: '',
  centre_thickness: '',
  edge_thickness: '',
  test_procedure: '',
  reference_standard: '',
  check_maker: '',
})
const fileList = ref<UploadUserFile[]>([

]);
let filename = formInline.mat_no + "_DB.png";
const checkFileAndSetImage = async () => {
  try {
    const response = await axios.get(`http://10.162.72.16:10004/DiBei/${filename}`);
    if (response.status === 200) {
      // 文件存在，设置图片URL
      fileList.value = [{
        name: formInline.mat_no + "_DB.png",
        url: `http://10.162.72.16:10004/DiBei/${filename}`
      }]
    } else {
      // 文件不存在，清空图片URL
      fileList.value = [];
    }
  } catch (error) {
    console.error('检查文件时发生错误:', error);
    fileList.value = [];
  }
};



const props = defineProps({
  dialogFormVisible: Boolean,
  formData: Object,
})

watch(() => props, (newValue) => {
  // 当 formData 变化时更新 formInline
  console.log(newValue.formData!.heat_no);
  formInline.heat_no = newValue.formData!.heat_no;
  formInline.st_no = newValue.formData!.st_no;
  formInline.mat_no = newValue.formData!.mat_no;
  //如果画面显示，则查看后台是否有对应的图片
  if (newValue.dialogFormVisible === true) {
    filename = formInline.mat_no + "_DB.png";
    checkFileAndSetImage();
  }
}, { deep: true });
const upload = ref<UploadInstance>()



const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}



const emits = defineEmits(["formSubmitted", "handleClose"])
const handleConfirm = () => {
  console.log(upload);
  console.log(176);
  upload.value!.submit();
  emits("formSubmitted", formInline);
  emits("handleClose");
}
const handleCancel = () => {
  emits("handleClose");
}
const beforeClose = () => {
  emits("handleClose");
}


const beforeAvatarUpload: UploadProps['beforeUpload'] = async (file) => {
  const newFileName = formInline.mat_no + "_DB.png";
  const newFile = new File([file], newFileName, { type: file.type });
  // 然后使用 newFile 替换原来的 file 对象
  return newFile;
}

</script>

<style>
.dialog-format.upload-format {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  flex-direction: column;


}
  .el-upload__tip {
    display: flex;
  }

.select {
  width: 199px;
}

.el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  /* 使用cover属性确保图片完全填充el-upload组件 */
}
</style>
