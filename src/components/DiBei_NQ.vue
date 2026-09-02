<template>
  <el-dialog :model-value="dialogFormVisible" :before-close="beforeClose" title="低倍硫印" width="1200"
    class="dialog-format">
    <el-dialog v-model:visible="dialogVisible1">请输入材料号！！！！ </el-dialog>

    <el-dialog v-model="dialogVisible">
      <img w-full="" :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
    </el-dialog>
    <el-form-item label="错误信息">
      <el-input v-model="formInline.msgerr" />
    </el-form-item>
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
      <el-button type="primary" @click="handleget()">获取</el-button>
      <el-form-item label="规格">
        <el-input v-model="formInline.mat_thick" />
      </el-form-item>
      <el-form-item label="机组">
        <el-input v-model="formInline.dev_code" />
      </el-form-item>
      <el-form-item label="碳锈区分">
        <el-select v-model="formInline.c_div" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsSmb1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="南北区">
        <el-select v-model="formInline.area" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts04" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="中心偏析与疏松">
        <el-select v-model="formInline.center_sgrg_porosity" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts01" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="中心裂纹">
        <el-select v-model="formInline.crack_center" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="等轴晶比例">
        <el-input v-model="formInline.equiaxed_grain_percentage_r" />
      </el-form-item>
      <el-form-item label="等轴晶宽度">
        <el-input v-model="formInline.equiaxed_grain_width" />
      </el-form-item>
      <el-form-item label="三角区裂纹级别">
        <el-select v-model="formInline.tri_crack_grade" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="角裂级别">
        <el-select v-model="formInline.angle_crack_grade" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="横向内裂">
        <el-select v-model="formInline.transverse_internal_crack" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="纵向内裂">
        <el-select v-model="formInline.longitudinal_internal_crack" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="其他缺陷描述">
        <el-input v-model="formInline.other_defects_description" />
      </el-form-item>

      <el-form-item label="裂纹">
        <el-select v-model="formInline.crack" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts03" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
      <el-form-item label="制样人">
        <el-select v-model="formInline.sample_maker" placeholder="Select" style="width: 200px">
          <el-option v-for="item in optionsQmts02" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="审核责任者">
        <el-input v-model="formInline.check_maker" />
      </el-form-item>
      <el-form-item label="试验过程">
        <el-input v-model="formInline.test_procedure" />
      </el-form-item>
    </el-form>
    <el-upload ref="upload" action="http://10.162.72.16:10004/DiBei" list-type="picture-card" :auto-upload="false"
      :before-upload="beforeAvatarUpload" class="upload-format" :limit="2" v-model:file-list="fileList"
      style="display: flex; place-content: end; height: 200px">
      <el-icon>
        <Plus />
      </el-icon>
      <template #tip="">
        <div class="el-upload__tip"></div>
      </template>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon>
                <zoom-in />
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
    </el-upload>
    <template #footer="">
      <div class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleConfirm()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup="">
  import { reactive, ref, onMounted, watch, nextTick } from "vue";
  import { Delete, Download, MessageBox, Plus, ZoomIn } from "@element-plus/icons-vue";
  import type {
  UploadInstance,
  UploadFile,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
  } from "element-plus";
  import axios from "axios";
  import { ElMessage } from "element-plus";
  import { EIManager, EI } from "EIX/ei";
  import { ER } from "ERX/Er";
  import xrEfForm from "EFX/xrEfForm";
  import xrEfPanel from "EFX/xrEfPanel";
  import erLayout from "ERX/ErLayout";
  import erGrid from "ERX/ErGrid";
  import ErPopFree from "ERX/ErPopFree";

  const dialogImageUrl = ref("");
  const dialogVisible = ref(false);
  const dialogVisible1 = ref(false);
  let disabled = ref(true);
  const formInline = reactive({
  heat_no: " ",
  st_no: "",
  mat_no: "",
  mat_thick: "",
  dev_code: "",
  c_div: "",
  area: "",
  center_sgrg_porosity: "",
  crack_center: "",
  equiaxed_grain_width: "",
  equiaxed_grain_percentage_r: "",
  tri_crack_grade: "",
  angle_crack_grade: "",
  transverse_internal_crack: "",
  longitudinal_internal_crack: "",
  other_defects_description: "",
  crack: "",
  inner_arc_width: "",
  outter_arc_width: "",
  centre_thickness: "",
  edge_thickness: "",
  test_procedure: "",
  reference_standard: "",
  check_maker: "",
  sample_maker: "",
  msgerr: "",
  });
  interface Option {
  value: string;
  label: string;
  }
  const optionsQmts01 = ref<Option[]>
    ([]);
    const optionsQmts02 = ref<Option[]>
      ([]);
      const optionsQmts03 = ref<Option[]>
        ([]);
        const optionsQmts04 = ref<Option[]>
          ([]);
          const optionsSmb1 = ref<Option[]>
            ([]);
            const fileList = ref<UploadUserFile[]>
              ([]);
              const erFormHelper1: ER.FormHelper = new ER.FormHelper();
              const checkFileAndSetImage = async () => {
              try {
              fileList.value = [];
              let filename = formInline.mat_no + "_1_DB.png";
              let response = await axios.get(`http://10.162.72.16:10004/DiBei/${filename}`);
              if (response.status === 200) {
              // 文件存在，设置图片URL
              fileList.value.push({
              name: filename,
              url: `http://10.162.72.16:10004/DiBei/${filename}`,
              });
              }
              filename = formInline.mat_no + "_2_DB.png";
              response = await axios.get(`http://10.162.72.16:10004/DiBei/${filename}`);
              if (response.status === 200) {
              // 文件存在，设置图片URL
              fileList.value.push({
              name: filename,
              url: `http://10.162.72.16:10004/DiBei/${filename}`,
              });
              }
              } catch (error) {
              console.error("检查文件时发生错误:", error);
              //fileList.value = [];
              }
              };

              const props = defineProps({
              dialogFormVisible: Boolean,
              formData: Object,
              });

              watch(
              () => props,
              (newValue) => {
              // 当 formData 变化时更新 formInline

              //如果画面显示，则查看后台是否有对应的图片
              if (newValue.dialogFormVisible === true) {
              checkFileAndSetImage();
              }
              },
              { deep: true }
              );
              const upload = ref<UploadInstance>
                ();

                onMounted(async () => {
                let codeClass = new EI.EIInfo();
                const inInfo = new EI.EIInfo();
                const inBlock = inInfo.addBlock(new EI.EiBlock(), "CODE");
                inBlock.addColumns("CODE_CLASS");
                inBlock.addRow({
                CODE_CLASS: "QMTS01",
                });
                inBlock.addRow({
                CODE_CLASS: "QMTS02",
                });
                inBlock.addRow({
                CODE_CLASS: "QMTS03",
                });
                inBlock.addRow({
                CODE_CLASS: "QMTS04",
                });
                inBlock.addRow({
                CODE_CLASS: "SMB1",
                });
                codeClass = await EIManager.callService("TGT8Z", "qmts_class_code", inInfo);
                for (let data of codeClass.blocks["QMTS01"].data) {
                optionsQmts01.value.push({
                value: data.CODE as string,
                label: data.CODE_DESC_1_CONTENT as string,
                });
                }
                for (let data of codeClass.blocks["QMTS02"].data) {
                optionsQmts02.value.push({
                value: data.CODE_DESC_1_CONTENT as string,
                label: data.CODE_DESC_1_CONTENT as string,
                });
                }
                for (let data of codeClass.blocks["QMTS03"].data) {
                optionsQmts03.value.push({
                value: data.CODE as string,
                label: data.CODE_DESC_1_CONTENT as string,
                });
                }
                for (let data of codeClass.blocks["QMTS04"].data) {
                optionsQmts04.value.push({
                value: data.CODE as string,
                label: data.CODE_DESC_1_CONTENT as string,
                });
                }
                for (let data of codeClass.blocks["SMB1"].data) {
                optionsSmb1.value.push({
                value: data.CODE as string,
                label: data.CODE_DESC_1_CONTENT as string,
                });
                }
                });

                const handleRemove = async (file: UploadFile) => {
                try {
                const response = await axios.delete(
                `http://10.162.72.16:10004/delete/${encodeURIComponent(file.name)}`
                );
                console.log(response.data.message);
                //await fetchFiles();再查一次后台，也可以，试试其他方法
                fileList.value.splice(fileList.value.indexOf(file), 1);
                } catch (error) {
                fileList.value.splice(fileList.value.indexOf(file), 1);
                console.error("Error during file deletion:", error);
                }
                };

                const handlePictureCardPreview = (file: UploadFile) => {
                dialogImageUrl.value = file.url!;
                dialogVisible.value = true;
                };

                const handleDownload = async (file: UploadFile) => {
                // 发送 GET 请求获取文件数据
                fetch(file.url as string)
                .then((response) => response.blob())
                .then((blob) => {
                // 创建一个隐藏的 <a>
                  元素
                  var hiddenAnchor = document.createElement("a");
                  hiddenAnchor.href = window.URL.createObjectURL(blob);
                  hiddenAnchor.download = file.name; // 如果要指定下载文件的名称，可以在这里设置
                  document.body.appendChild(hiddenAnchor);
                  hiddenAnchor.click(); // 模拟点击链接进行下载
                  document.body.removeChild(hiddenAnchor); // 下载完成后移除 <a>
                    元素
                    })
                    .catch((error) => console.error("下载文件时出错：", error));
                    };

                    const emits = defineEmits(["formSubmitted", "handleClose"]);
                    const handleConfirm = () => {
                    upload.value!.submit();
                    emits("formSubmitted", formInline);
                    emits("handleClose");
                    };
                    const handleCancel = () => {
                    emits("handleClose");
                    };
                    const beforeClose = () => {
                    emits("handleClose");
                    };
                    const handleget = async () => {
                    if (formInline.mat_no === "") {
                    formInline.msgerr = "请输入材料号！！！！！";
                    return;
                    }
                    formInline.msgerr = "";
                    const eiInfo = new EI.EIInfo();
                    const eiBlock = new EI.EiBlock();
                    eiBlock.pushData({ MAT_NO: formInline.mat_no }, true);
                    console.log("lxx1", eiBlock);
                    eiInfo.addBlock(eiBlock, "Table0");
                    await erFormHelper1.callService("qmts27_nq_inq", eiInfo, true, false).then((res) => {
                    const mainData = res.blocks["Table0"].data;
                    nextTick(() => {
                    if (res.status >= 0) {
                    formInline.heat_no = mainData[0]["HEATID"] as string;
                    formInline.st_no = mainData[0]["STEELGRADE"] as string;
                    formInline.mat_thick = mainData[0]["WIDTH"] as string;
                    formInline.dev_code = mainData[0]["AGGREGATECODE"] as string;
                    console.log("LXXX", formInline.heat_no);
                    //formInline.c_div = "I";
                    formInline.area = "南";
                    } else {
                    formInline.msgerr = "未查询到相关信息，请检查材料号";
                    }
                    });
                    });
                    };

                    const beforeAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
                    let index = 0;
                    for (let i = 0; i < fileList.value.length; i++) {
    if (fileList.value[i].name === file.name) {
      index = i + 1;
    }
  }
  const newFileName = formInline.mat_no + "_" + index + "_DB.png";
  const newFile = new File([file], newFileName, { type: file.type });
  // 然后使用 newFile 替换原来的 file 对象
  return newFile;
};
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

  .box_1 {
  z-index: 10000;
  }
</style>
