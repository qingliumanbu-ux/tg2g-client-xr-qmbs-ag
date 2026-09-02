<template>
  <el-dialog :model-value="dialogFormVisible" :before-close="beforeClose" title="上传图片" width="1200"
    class="dialog-format">

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
    </el-dialog>
    <el-form :inline="true" :model="formInline" label-width="auto" class="demo-form-inline">
      <el-form-item label="卡号">
        <el-input v-model="formInline.truck_seq_no" placeholder="Approved by" readonly="true" />
      </el-form-item>
      <el-form-item label="炉号">
        <el-input v-model="formInline.c_stoveid" readonly="true" />
      </el-form-item>
      <el-form-item label="热轧材料号">
        <el-input v-model="formInline.hot_mat_no" readonly="true" />
      </el-form-item>
    </el-form>
    <el-upload ref="upload" action="http://10.162.72.16:10004/ShangQi" list-type="picture-card" :auto-upload="false"
      :before-upload="beforeAvatarUpload" class="upload-format" :limit="100" v-model:file-list="fileList"
      :multiple="true" style="display: flex;place-content: center;height: 200px;">
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
import { ElMessage } from 'element-plus'
import { EIManager, EI } from 'EIX/ei';


const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const formInline = reactive({
  truck_seq_no: '',
  c_stoveid: '',
  hot_mat_no: ''
})
interface Option {
  value: string;
  label: string;
}
const optionsQmts01 = ref<Option[]>([]);
const optionsQmts02 = ref<Option[]>([]);
const optionsQmts03 = ref<Option[]>([]);
const optionsQmts04 = ref<Option[]>([]);
const optionsSmb1 = ref<Option[]>([]);
const fileList = ref<UploadUserFile[]>([

]);

const checkFileAndSetImage = async () => {
  let name_l = [formInline.c_stoveid + ".png", formInline.c_stoveid + "_1.png", formInline.c_stoveid + "_2.png", formInline.truck_seq_no + ".png", formInline.truck_seq_no + "_1.png", formInline.truck_seq_no + "_2.png", formInline.c_stoveid + ".jpg", formInline.c_stoveid + "_1.jpg", formInline.c_stoveid + "_2.jpg", formInline.truck_seq_no + ".jpg", formInline.truck_seq_no + "_1.jpg", formInline.truck_seq_no + "_2.jpg"];
  fileList.value = [];
  for (let i = 0; i < name_l.length; i++) {
    try {

      let filename = name_l[i];
      let response = await axios.get(`http://10.162.72.16:10004/ShangQi/${filename}`);
      if (response.status === 200) {
        // 文件存在，设置图片URL
        fileList.value.push({
          name: filename,
          url: `http://10.162.72.16:10004/ShangQi/${filename}`
        })
      }

    } catch (error) {
      console.error('检查文件时发生错误:', error);
      //fileList.value = [];
      continue;
    }
  }

};



const props = defineProps({
  dialogFormVisible: Boolean,
  formData: Object,
})

watch(() => props, (newValue) => {
  console.log('111', newValue);
  // 当 formData 变化时更新 formInline
  formInline.truck_seq_no = newValue.formData!.truck_seq_no;
  formInline.c_stoveid = newValue.formData!.c_stoveid;
  formInline.hot_mat_no = newValue.formData!.hot_mat_no;


  //如果画面显示，则查看后台是否有对应的图片
  if (newValue.dialogFormVisible === true) {
    checkFileAndSetImage();
  }
}, { deep: true });
const upload = ref<UploadInstance>()

onMounted(async () => {
});

const handleRemove = async (file: UploadFile) => {
  try {
    const response = await axios.delete(`http://10.162.72.16:10004/deletesq/${encodeURIComponent(file.name)}`);
    console.log(response.data.message);
    //await fetchFiles();再查一次后台，也可以，试试其他方法
    fileList.value.splice(fileList.value.indexOf(file), 1);
  } catch (error) {
    fileList.value.splice(fileList.value.indexOf(file), 1);
    console.error('Error during file deletion:', error);
  }
}

const handlePictureCardPreview = (file: UploadFile) => {
  console.log('iuhghjiokjnb', file)
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = async (file: UploadFile) => {
  // 发送 GET 请求获取文件数据
  fetch(file.url as string)
    .then(response => response.blob())
    .then(blob => {
      // 创建一个隐藏的 <a> 元素
      var hiddenAnchor = document.createElement('a');
      hiddenAnchor.href = window.URL.createObjectURL(blob);
      hiddenAnchor.download = file.name; // 如果要指定下载文件的名称，可以在这里设置
      document.body.appendChild(hiddenAnchor);
      hiddenAnchor.click(); // 模拟点击链接进行下载
      document.body.removeChild(hiddenAnchor); // 下载完成后移除 <a> 元素
    })
    .catch(error => console.error('下载文件时出错：', error));
}



const emits = defineEmits(["formSubmitted", "handleClose"])
const handleConfirm = () => {
  console.log('uhbnkl', upload)
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
  let index = 0
  for (let i = 0; i < fileList.value.length; i++) {
    if (fileList.value[i].name === file.name) {
      index = i + 1;
    }
  }
  const newFileName = formInline.c_stoveid + "_" + index + ".png";
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

.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 148px;
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  right: 150px;
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
