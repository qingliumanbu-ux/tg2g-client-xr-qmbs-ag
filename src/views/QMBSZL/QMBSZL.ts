
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  computed,
  nextTick,
  Ref,
  toRaw,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
// import { SiUtils } from "ERX/SiUtils";
// import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";

import xrEfDialog from "EFX/xrEfDialog";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import type {
  UploadInstance,
  UploadFile,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from "element-plus";
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import axios from 'axios';

export default defineComponent({
  name: "QMBSZLS2N",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog, Plus, Delete, Download, ZoomIn
  },
  // 接收父画面传递过来的参数
  props: {
    openInDialog: {
      type: Boolean,
      default: false,
    },
    dialogFormName: {
      type: String,
      default: "",
    },
    parentInfo: {
      type: Object,
    },
  },
  // 向父画面传递数据-注册emit监听事件
  emits: ["getChildInfo"],
  // setup中添加props和emit
  setup: (props, { emit }) => {
    // 变量定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    let gridview: any;

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.form_name) {
        PROGRAM_NAME = efFormInfo.value.formParams["form_name"];
      }
      initializePage();
    };
    const erGridReady = (e: any) => {
      gridview = erFormHelper.getGrid(LayoutName);
    }
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const initializeService = "wm00_form_get";
    let i_form_ename = props.dialogFormName; // 低代码配置画面布局名
    const LayoutName = props.parentInfo?.LayoutName;
    const fileList = ref<UploadUserFile[]>([

    ]);
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const disabled = ref(false)
    const upload = ref<UploadInstance>()
    const title_top = ref('')

    // 画面相关数据初始化
    const initializePage = async () => {

      const initialResult = await erFormHelper.Initialize(
        formPartition,
        i_form_ename,
        "",
        initializeService
      );
      console.log('wswesdss', props.parentInfo?.mainData, LayoutName, i_form_ename)
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;


        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {

          erFormHelper.stopGridEditing(LayoutName, () => {
            erFormHelper.setControlValueEx(LayoutName, { ...props.parentInfo?.mainData.data[0] });
          })

          let mat_no = '';
          for (let index = 0; index < props.parentInfo?.mainData.data.length; index++) {
            if (index == props.parentInfo?.mainData.data.length - 1) {
              mat_no = mat_no + props.parentInfo?.mainData.data[index].MAT_NO + "(" + props.parentInfo?.mainData.data[index].ST_NO + "," + props.parentInfo?.mainData.data[index].SG_GRADE_1 + ")";
            } else {
              mat_no = mat_no + props.parentInfo?.mainData.data[index].MAT_NO + "(" + props.parentInfo?.mainData.data[index].ST_NO + "," + props.parentInfo?.mainData.data[index].SG_GRADE_1 + "),";
            }

          }
          title_top.value = "您选择了" + mat_no + "材料号";

          checkFileAndSetImage();
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
          initialResult.msg +
          "]!"
        );
      }
    };






    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {

      };
      emit("getChildInfo", data);

    };

    onMounted(() => {
      console.log('iujhjkl', upload)
    });



    //const emits = defineEmits(["formSubmitted"])
    const F2_DO = async () => {
      console.log('iujhjkl', upload)
      upload.value!.submit();

      const inInfo = new EI.EIInfo();

      inInfo.addBlock(props.parentInfo?.mainData);
      inInfo.addBlock(erFormHelper.buildEiBlock([{
        RES_PROCESS: erFormHelper.getControlValue('QMTS30_DIALOG1', 'RES_PROCESS'),
        CK_REMARK: erFormHelper.getControlValue('QMTS30_DIALOG1', 'CK_REMARK'),
        FINAL_OPINION: erFormHelper.getControlValue('QMTS30_DIALOG1', 'FINAL_OPINION'),
        STEAL_REMARK: erFormHelper.getControlValue('QMTS30_DIALOG1', 'STEAL_REMARK'),
        USER_NAME: erFormHelper.getControlValue('QMTS30_DIALOG1', 'USER_NAME'),
        REASON: erFormHelper.getControlValue('QMTS30_DIALOG1', 'REASON'),
        PRO_DIV: 'UPD',
        HEAT_NO_COM: erFormHelper.getControlValue('QMTS30_DIALOG1', 'HEAT_NO_COM'),
        ST_NO_COM: erFormHelper.getControlValue('QMTS30_DIALOG1', 'ST_NO_COM'),
        CHANGE_ST_NO: erFormHelper.getControlValue('QMTS30_DIALOG1', 'CHANGE_ST_NO'),
        TO_DEV_CODE: erFormHelper.getControlValue('QMTS30_DIALOG1', 'TO_DEV_CODE')
      }]), 'PARA')
      console.log('inInfo', inInfo, props.parentInfo?.callService);

      const outInfo = await erFormHelper.callService(props.parentInfo?.callService, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      closeEfDialog();
    };
    const beforeAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
      let index = 0;
      for (let i = 0; i < fileList.value.length; i++) {
        if (fileList.value[i].name === file.name) {
          index = i + 1;
        }
      }
      const newFileName = erFormHelper.getControlValue('QMTS30_DIALOG1', 'MAT_NO') + "_" + index + ".png";
      console.log('iujhjkl', newFileName)
      const newFile = new File([file], newFileName, { type: file.type });
      // 然后使用 newFile 替换原来的 file 对象
      return newFile;
    };
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
    const checkFileAndSetImage = async () => {
      let name_l = [props.parentInfo?.mainData.data[0].MAT_NO + "_3.png", props.parentInfo?.mainData.data[0].MAT_NO + "_1.png", props.parentInfo?.mainData.data[0].MAT_NO + "_2.png", props.parentInfo?.mainData.data[0].MAT_NO + "_3.jpg", props.parentInfo?.mainData.data[0].MAT_NO + "_1.jpg", props.parentInfo?.mainData.data[0].MAT_NO + "_2.jpg"];
      fileList.value = [];
      for (let i = 0; i < name_l.length; i++) {
        try {

          let filename = name_l[i];
          let response = await axios.get(`http://10.162.72.16:10004/ChuZhi/${filename}`);
          if (response.status === 200) {
            // 文件存在，设置图片URL
            fileList.value.push({
              name: filename,
              url: `http://10.162.72.16:10004/ChuZhi/${filename}`
            })
          }

        } catch (error) {
          console.error('检查文件时发生错误:', error);
          //fileList.value = [];
          continue;
        }
      }

    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      closeEfDialog, LayoutName, F2_DO, erGridReady, beforeAvatarUpload, fileList, handlePictureCardPreview, disabled, handleDownload, handleRemove, upload, dialogVisible, dialogImageUrl, title_top

    };
  },
});
