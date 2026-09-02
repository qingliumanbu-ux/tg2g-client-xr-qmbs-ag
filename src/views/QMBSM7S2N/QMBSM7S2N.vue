<template>
  <el-upload v-model:file-list="fileList" class="upload-demo" action="http://10.162.72.16:10004/DiBei"
    :show-file-list="false">
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        any files
      </div>
    </template>
  </el-upload>
  <el-row>
    <el-col v-for="(file, index) in fileList" :key="file.name" :span="24 / colFile" :offset="1">
      <el-card :body-style="{ padding: '10px' }" class="upload-card">
        <div class="header">
          <el-popconfirm title="确认要删除文件吗?" @confirm="removeFile(file)">

            <template #reference>
              <el-button type="danger" :icon="Delete" circle class="delete-pop"></el-button>
            </template>
          </el-popconfirm>
        </div>
        <img class="image" :src="getImageUrl(file)" alt="" />
        <div class="file-name">
          <span>{{ file.name }}</span>
        </div>
        <div class="bottom">
          <el-button text type="primary" class="button" @click="previewFile(file)">预览</el-button>
          <el-button text type="success" class="button" @click="downloadFile(file)">下载</el-button>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import type { UploadProps, UploadUserFile } from 'element-plus'
import { Delete } from '@element-plus/icons-vue';

const fileList = ref<UploadUserFile[]>([]);
const colFile = 5;//文件的列数

// 获取服务器上的文件列表
const fetchFiles = async () => {
  try {
    const response = await axios.get('http://10.162.72.16:10004/files');
    fileList.value = response.data.map((file: any) => ({
      name: file,
      url: `http://10.162.72.16:10004/DiBei/${file}`, // 文件的访问URL
    }));
  } catch (error) {
    console.error("There was an error fetching the files: ", error);
  }
};

onMounted(() => {
  fetchFiles();
});

const previewFile = async (file: any) => {
  console.log(file);
  const addTypeArray = file.name.split(".");
  const addType = addTypeArray[addTypeArray.length - 1];
  if (['pdf', 'png', 'jpg'].includes(addType)) {
    window.open(file.url, '_blank');
  }
  else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.xls')) {
    window.open(
      "http://view.officeapps.live.com/op/view.aspx?src=" + file.response
    );
  }
  else {
    console.log('Preview not implemented for this file type');
  }
}
const downloadFile = (file: any) => {
  // 发送 GET 请求获取文件数据
  fetch(file.url)
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
const removeFile = async (file: any) => {
  try {
    const response = await axios.delete(`http://10.162.72.16:10004/delete/${encodeURIComponent(file.name)}`);
    console.log(response.data.message);
    //await fetchFiles();再查一次后台，也可以，试试其他方法
    fileList.value.splice(fileList.value.indexOf(file), 1);
  } catch (error) {
    console.error('Error during file deletion:', error);
  }
}
const getImageUrl = (file: any) => {
  const isDoc = ['doc', 'docx'];
  const isXls = ['xlsx', 'xls'];
  const isPdf = ['pdf'];
  const addTypeArray = file.name.split(".");
  const addType = addTypeArray[addTypeArray.length - 1];
  if (isDoc.includes(addType)) {
    return 'img/doc.png';
  } else if (isXls.includes(addType)) {
    return 'img/xls.png';
  } else if (isPdf.includes(addType)) {
    return 'img/pdf.png';
  } else {
    return file.url;
  }
}
</script>

<style>
.upload-demo {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  flex-direction: column;

  .el-upload__tip {
    display: flex;
    justify-content: center;
  }
}

.upload-card {
  display: flex;

  .header {
    .delete-pop {
      float: right;
      margin-bottom: 5px;
    }
  }
}



.file-name {
  padding: 14px;
  display: flex;
  justify-content: center;
}

.image {
  width: 200px;
  /* 设置图片宽度 */
  height: 150px;
  /* 设置图片高度 */
  object-fit: scale-down;
  /* 保持图片比例，填充整个容器 */
}

.bottom {
  display: flex;
  justify-content: center;
}
</style>
