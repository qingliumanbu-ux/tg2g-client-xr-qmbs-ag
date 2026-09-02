import { defineComponent, onMounted, ref, nextTick } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";

export default defineComponent({
  name: 'QMBSM1',
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
    let dt_key = new EI.EiBlock();
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
        addrow: true,
        copyrow: true,
        delete: true,
        excel: true
      });
    };
    // 自定义grid工具栏按钮是否可用
    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible,
        delete: visible
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
        tableName: 'T' + efFormInfo.value.formParams['table_name'],
        colName: '*',
        ORDER_BY: 'STEEL_GRADE',
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

    //保存
    const F7_DO = async () => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
      if (!erFormHelper.hasDataChange('gridView_main')) {
        erFormHelper.messageWarning('无数据更改,不需要保存');
        return;
      }
      const eiInfo = new EI.EIInfo();
      const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView_main');

      //获取新增行的数据
      const created = erFormHelper.getGridRowsAsBlock(grid_main, 'add');

      //获取修改行的数据
      const updated = erFormHelper.getGridRowsAsBlock(grid_main, 'modify');

      //获取删除行的数据
      const deleted = erFormHelper.getGridRowsAsBlock(grid_main, 'delete');
      await erFormHelper.stopGridEditing('gridView_main', () => {
        eiInfo.addBlock(selectRows, 'ROW_CODE');
        eiInfo.addBlock(created, 'B_ADD');
        eiInfo.addBlock(updated, 'B_UPD');
        eiInfo.addBlock(deleted, 'B_DEL');
      });
      const outInfo = await erFormHelper.callService('qmbsm_save_pro', eiInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageInfo('操作成功。');
        // 隐藏工具栏按钮
        setToolbarVisible('gridView_main', false);
        erFormHelper.setGridEditable('gridView_main', false);
      }
    };
    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      F7_DO,
      efFormReady,
      erGrid1Ready
    };
  }
});
