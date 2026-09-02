import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  toRaw,
  nextTick,
  Ref,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import ErPopFree from "ERX/ErPopFree";
import ErPopQuery from "ERX/ErPopQuery";
import ShangQ from "../../components/ShangQ.vue";
import ShangQDR from "../../components/ShangQDR.vue";
import { PopQueryReturnInfo, PopFreeReturnInfo } from "ERX/er-type";

export default defineComponent({
  name: "QMTSSQS2N",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ShangQ,
    ShangQDR,
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: "";
    let PROGRAM_NAME: string;
    let i_form_ename = ""; // 低代码配置画面布局名
    let grid_main!: any;
    let popFreeEdit: ER.PopFreeHelper;
    const gridView_main = ref("gridView_main");
    const initializeService = "";
    const formData = {
      truck_seq_no: "",
      c_stoveid: "",
      hot_mat_no: "",
    };

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log("formName", formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams["PROGRAM_NAME"];
      }

      initializePage();
    };
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        i_form_ename,
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {});
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_main.value);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        excel: true,
      });
    };

    const setToolbarVisible1 = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        import: true,
        excel: true,
      });
    };
    const setToolbarVisible2 = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        refresh: false,
        import: false,
        excel: true,
      });
    };
    const F2_DO = async () => {
      query();
    };
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService("qmtssq_inq", inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_main.value);
      }
    };
    //F5点击事件：导入
    const F3_PRE_DO = async (e: any) => {
      // 设置工具栏按钮可见
      setToolbarVisible1(gridView_main.value, true);
      //清除缓存 gridView_main
      erFormHelper.clearGridData("gridView_main");
    };
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      setToolbarVisible2(gridView_main.value, true);

      if (erFormHelper.getGridCheckedRows("gridView_main").length === 0) {
        erFormHelper.messageWarning("请选择要导入的信息！");
        return false;
      }
      console.log(erFormHelper.getGridCheckedRows("gridView_main").length);
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock("gridView_main"));
      console.log("inInfo", inInfo);
      outInfo = await erFormHelper.callService(
        "qmtssq_pro",
        inInfo,
        false,
        true,
        true
      );

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess("操作成功！");
      }
      query();
    };
    const F3_CANCEL = async (e: any) => {
      setToolbarVisible2(gridView_main.value, true);
      query();
    };
    const F4_DO = async (e: any) => {
      const currentRow =
        erFormHelper.getGridCheckedRowsAsBlock("gridView_main");
      if (currentRow.data.length < 1) {
        erFormHelper.messageWarning("请选择一条信息再上传！");
        return;
      }
      console.log("999", formData);
      formData.truck_seq_no = currentRow.data[0].TRUCK_SEQ_NO as string;
      console.log("000", formData.truck_seq_no);

      formData.c_stoveid = currentRow.data[0].C_STOVEID as string;
      formData.hot_mat_no = currentRow.data[0].HOT_MAT_NO as string;
      dialogFormVisible.value = true;
    };
    const F5_DO = async (e: any) => {
      formData.truck_seq_no = "";
      formData.c_stoveid = "";
      formData.hot_mat_no = "";
      dialogFormVisibleDR.value = true;
    };
    const dialogFormVisible = ref(false);
    const dialogFormVisibleDR = ref(false);
    const handleFormSubmitted = async (data: any) => {
      const value = toRaw(data);

      const inInfo = new EI.EIInfo();
      const inBlock = inInfo.addBlock(new EI.EiBlock(), "QMTSSQ_ADD");

      for (let item in value) {
        inBlock.addColumns(item);
      }
      inBlock.addRow(value);
      erFormHelper.messageSuccess("操作成功");
    };
    const showDialog = () => {
      dialogFormVisible.value = true;
    };
    const showDialogDR = () => {
      dialogFormVisibleDR.value = true;
    };
    const handleClose = () => {
      dialogFormVisible.value = false;
    };
    const handleCloseDR = () => {
      dialogFormVisibleDR.value = false;
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      erGrid1Ready,
      gridView_main,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F5_DO,
      handleFormSubmitted,
      showDialog,
      handleClose,
      showDialogDR,
      handleCloseDR,
      dialogFormVisible,
      dialogFormVisibleDR,
      formData,
    };
  },
});
