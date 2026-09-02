import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'QMBSM6',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
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
    let grid_main1!: any;
    let popFreeEdit: ER.PopFreeHelper;
    const gridView_main = ref('gridView_main');
    const gridView_main1 = ref('gridView_main1');

    const initializeService = 'qmts_form_get';


    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('formName', formName);
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
        nextTick(() => {
        });
      } else {
        erFormHelper.messageError(
          'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
        );
      }
    };

    onMounted(() => { });
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_main.value);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      grid_main1 = erFormHelper.getGrid(gridView_main1.value);
      erFormHelper.setGridToolbarVisible(gridView_main1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };


    const F2_DO = async () => {
      query();
    };
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('qmts28_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageInfo(outInfo.sys.msg);
        return;
      }
      erFormHelper.clearGridData(gridView_main.value);
      if (outInfo.getBlock(0).data.length > 0) {
        let list = {};
        list = outInfo.getBlock(0);
        erFormHelper.mergeDataToGrid(list, gridView_main.value);
      }

      erFormHelper.mergeDataToGrid(outInfo.getBlock(1), gridView_main1.value);
    };

    const F3_DO = async () => {

    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      erGrid1Ready,
      erGrid2Ready,
      gridView_main,
      gridView_main1,
      F3_DO
    };
  }
});
