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
  name: 'QMTSBWU',
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
    let grid_main2!: any;
    let popFreeEdit: ER.PopFreeHelper;
    const gridView_main = ref('gridView_main');
    const gridView_main1 = ref('gridView_main1');
    const gridView_main2 = ref('gridView_main2');
    let cs_OkClick = '';
    let i_proc_div = '';
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
    const erGrid3Ready = () => {
      grid_main2 = erFormHelper.getGrid(gridView_main2.value);
      erFormHelper.setGridToolbarVisible(gridView_main2.value, {
        addrow: false,
        copyrow: false,
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
    const setToolbarVisible1 = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        import: true,
        excel: true
      });
    };
    const setToolbarVisible2 = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        refresh: false,
        import: false,
        excel: true
      });
    };

    //查询推送履历信息
    const getSubGridM = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('qmtsbwu_ins', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_main1.value);
      }
    };

    const F2_DO = async () => {
      query();
    };
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('qmtsbwu_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_main.value);
        getSubGridM();
      }
    };
    //查询对应的用户消息
    const p_query_qmtsbwu = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const eiblock = eiInfo.addBlock(new EI.EiBlock(), 'query_where');
        eiblock.addColumn('CODE');
        if (e.CODE === '') {
          return;
        } else {
          eiblock.addRow({
            CODE: e.CODE
          });
        }
        const outInfo = await erFormHelper.callService('qmbsbwu_yh_inqs', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return;
        }
        if (outInfo.getBlock(0).data.length > 0) {
          erFormHelper.mergeDataToGrid(outInfo.getBlock(0).data, 'gridView_main2');
        } else {
          erFormHelper.clearGridData('gridView_main2');
          return;
        }
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
        return;
      }
    };
    // 焦点行改变事件
    const gridView1FocusChanged = (e: any) => {
      if (e.data) {
        p_query_qmtsbwu(e.data);
      }
    };
    //自定义模板参数
    const popFreeEdit_pars = async (Click_name: string) => {
      if (cs_OkClick === 'F3') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTSBWU_DIALOG', 'QMTSBWU_LAYOUT_DIALOG1');
      }
      if (cs_OkClick === 'F4') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTSBWU_DIALOG', 'QMTSBWU_LAYOUT_DIALOG2');
      }
    };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          PRO_DIV: i_proc_div,
        }),
      );

      console.log('inInfo', inInfo);
      outInfo = await erFormHelper.callService('qmtsbwu_pro', inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query();
    };
    const F3_DO = async (e: any) => {
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_main', true)[0];
      cs_OkClick = 'F3';
      i_proc_div = 'ADD';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F4_DO = async (e: any) => {
      const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
      if (selectRows.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return false;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_main', true)[0];
      cs_OkClick = 'F4';
      i_proc_div = 'UPD';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F5_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
        if (selectRows.data.length < 1) {
          erFormHelper.messageInfo('没有选中数据。');
          return false;
        }
        const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
        if (!mes_res) {
          return false;
        }

        eiInfo.addBlock(selectRows, 'DEL');
        const outInfo = await erFormHelper.callService('qmtsbwu_pro', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return false;
        }
        query();
        erFormHelper.messageInfo('删除成功。');
      } catch (ex: any) {
        erFormHelper.messageConfirm(ex.message);
        erFormHelper.messageInfo('系统出现异常，请联系系统维护人员。');
      }
    };

    const F6_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
      //获取新增行的数据
      const created = erFormHelper.getGridRowsAsBlock(grid_main2, 'add');

      //获取修改行的数据
      const updated = erFormHelper.getGridRowsAsBlock(grid_main2, 'modify');

      //获取删除行的数据
      const deleted = erFormHelper.getGridRowsAsBlock(grid_main2, 'delete');
      await erFormHelper.stopGridEditing('gridView_main2', () => {
        eiInfo.addBlock(selectRows, 'ROW_CODE');
        eiInfo.addBlock(created, 'B_ADD');
        eiInfo.addBlock(updated, 'B_UPD');
        eiInfo.addBlock(deleted, 'B_DEL');
      });
      const outInfo = await erFormHelper.callService('qmtsbwu_pro', eiInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageInfo('操作成功。');
        // 隐藏工具栏按钮
        setToolbarVisible('gridView_main2', false);
        erFormHelper.setGridEditable('gridView_main2', false);
      }
    };

    const F6_PRE_DO = async (e: any) => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
      // 设置工具栏按钮可见
      setToolbarVisible(gridView_main2.value, true);
      //设置grid可编辑
      erFormHelper.setGridEditable(gridView_main2.value, true);
    };
    const F6_CANCEL = async (e: any) => {
      // 隐藏工具栏按钮
      setToolbarVisible(gridView_main2.value, false);
      //设置grid不可编辑
      erFormHelper.setGridEditable(gridView_main2.value, false);
      query();
    };

    //F7点击事件：导入
    const F7_PRE_DO = async (e: any) => {
      // 设置工具栏按钮可见
      setToolbarVisible1(gridView_main2.value, true);
      //清除缓存 gridView_main2
      erFormHelper.clearGridData('gridView_main2');
    };

    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      setToolbarVisible2(gridView_main2.value, true);

      if (erFormHelper.getGridCheckedRows('gridView_main2').length === 0) {
        erFormHelper.messageWarning('请选择要导入的信息！');
        return false;
      }
      console.log(erFormHelper.getGridCheckedRows('gridView_main2').length);

      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('gridView_main2'));
      const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView_main');
      inInfo.addBlock(selectRows, 'ROW_CODE');
      console.log('inInfo', inInfo);
      outInfo = await erFormHelper.callService('qmtsbwu_dy_pro', inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
        query();
      }
    }
    const F7_CANCEL = async (e: any) => {
      setToolbarVisible2(gridView_main2.value, true);
      query();
    }

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      gridView_main,
      gridView_main1,
      gridView_main2,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F6_PRE_DO,
      F6_CANCEL,
      F7_DO,
      F7_PRE_DO,
      F7_CANCEL,
      gridView1FocusChanged
    };
  }
});
