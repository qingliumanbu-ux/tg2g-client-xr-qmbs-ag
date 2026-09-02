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
  name: 'QMBSM5',
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
    let popFreeEdit: ER.PopFreeHelper;
    const gridView_main = ref('gridView_main');

    const initializeService = 'qmts_form_get';
    let cs_OkClick = '';

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
      console.log('gridView_main', gridView_main);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const popFreeEdit_pars = async (Click_name: string) => {
      if (cs_OkClick === 'F3') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMBS_DIALOG1', 'QMBS_LAYOUT_DIALOG');
      }
      if (cs_OkClick === 'F4') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMBS_DIALOG2', 'QMBS_LAYOUT_DIALOG');
      }
      if (cs_OkClick === 'F5') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMBS_DIALOG3', 'QMBS_LAYOUT_DIALOG');
      }
    };
    const popFreeEditOkClick = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('gridView_main'));
      inInfo.addBlock(erFormHelper.buildEiBlock([{
        SLAB_CHECK_RESULT: e.dataModel.SLAB_CHECK_RESULT,
        SIZE_DECIDE_CODE: e.dataModel.SIZE_DECIDE_CODE,
        DEFECT_CLASS: e.dataModel.DEFECT_CLASS,
        DEFECT_CODE: e.dataModel.DEFECT_CODE
      }]), 'Table2')

      outInfo = await erFormHelper.callService('qm_mmsm01_bp', inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query();
    };
    const popFreeEditOkClick2 = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      console.log('5555');
      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('gridView_main'));
      inInfo.addBlock(erFormHelper.buildEiBlock([{
        FULL_FURNACE: '否',
        REASON: e.dataModel.REASON
      }]), 'Table2')
      outInfo = await erFormHelper.callService('qmbsm5_qmts30_add', inInfo);
      if (outInfo?.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess('操作成功！');
      }
    };
    const popFreeEditOkClick3 = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      console.log('666');
      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('gridView_main'));
      inInfo.addBlock(erFormHelper.buildEiBlock([{
        FULL_FURNACE: '是',
        REASON: e.dataModel.REASON
      }]), 'Table2')
      outInfo = await erFormHelper.callService('qmbsm5_qmts30_add', inInfo);
      if (outInfo?.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess('操作成功！');
      }
    };


    const F2_DO = async () => {
      query();
    };
    const query = async () => {
      const inInfo = new EI.EIInfo();
      //自定义分页
      erFormHelper.setGridServerPagingQuery('gridView_main', inInfo, (queryPage: number) => {
        return new Promise(async (resolve, reject) => {
          const inInfo = new EI.EIInfo();
          //查询条件
          const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
          inInfo.addBlock(eiBlock, "infogrid" + queryPage);
          const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
          const grid = erFormHelper.getGrid('gridView_main');
          const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
          inInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
          await erFormHelper.callService(efFormInfo.value.formParams["service"], inInfo).then((res: any) => {
            console.log('111', efFormInfo.value.formParams["service"]);
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;

              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
            }
          });
          resolve(result);
        });
      });
      erFormHelper.setGridEditable("gridView_main", false);
    };
    const F3_DO = async () => {
      if (erFormHelper.getGridCheckedRows('gridView_main').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      }
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_main');
      console.log('123', mainGridCheckedRow);
      cs_OkClick = 'F3';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    const F4_DO = async () => {
      const selectRows = erFormHelper.getGridCheckedRows('gridView_main');
      if (selectRows.length < 1) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_main', true)[0];
      cs_OkClick = 'F4';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick2);
    };
    const F5_DO = async () => {
      const selectRows = erFormHelper.getGridCheckedRows('gridView_main');
      if (selectRows.length < 1) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_main', true)[0];
      cs_OkClick = 'F5';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick3);

    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      erGrid1Ready,
      gridView_main
    };
  }
});
