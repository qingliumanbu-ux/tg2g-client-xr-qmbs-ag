import { defineComponent, onMounted, ref, nextTick } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import axios from 'axios';

export default defineComponent({
  name: 'QMBSREPORT',
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
    const gridView_main = ref('gridView_main');

    const initializeService = 'qmts_form_get';

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams["PROGRAM_NAME"];
      }
      initializePage();
    };

    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    // 变量定义
    const initializeFlag = ref(0);
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

    onMounted(() => {

    });
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_main.value);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        delete: false,
        excel: true
      });
    };

    //查询
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const pageBlock = inInfo.addBlock(new EI.EiBlock(), 'page');
      pageBlock.addColumns('tableName', 'colName', 'ORDER_BY', 'PAGE_NUM', 'PAGE_SIZE');
      pageBlock.addColumns('tableName');
      pageBlock.addRow({
        tableName: efFormInfo.value.formParams['table_name'],
        colName: '*',
      });
      console.log(inInfo);
      const outInfo = await erFormHelper.callService('qmbsm_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, 'gridView_main');
      }
    };
    const F2_DO = async () => {
      await query();
    };


    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      efFormReady,
      erGrid1Ready
    };
  }
});
