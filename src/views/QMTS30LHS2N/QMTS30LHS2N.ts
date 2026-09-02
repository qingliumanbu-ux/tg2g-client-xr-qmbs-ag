import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager, buildEIInfo } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import xrEfDialog from 'EFX/xrEfDialog';
import ErPopFree from 'ERX/ErPopFree';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import { Console, log } from 'console';
import QMBSCZ from "../QMBSCZ/QMBSCZ.vue";

export default defineComponent({
  name: 'QMTS30LHS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
    ErPopFree, QMBSCZ
  },

  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: '';
    let UserName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let grid_main!: any;
    const gridView_tab1 = ref('GridView1');
    let LayoutGroupFilter = 'layoutControlGroup1';
    let F5_Status = 0; // F7按钮状态，0: 未进入多步，1: 进入多步


    const initializeService = '';
    //const tabActiveKey = ref('tab1');
    let i_proc_div = '';
    let cs_OkClick = '';
    let popFreeEdit: ER.PopFreeHelper;
    let grid_tab = '';

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('efFormInfo', formName);
      UserName = efFormInfo.value.UserName; // 当前用户名
      console.log('efFormInfo', UserName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };
    const erFormHelper: ER.FormHelper = new ER.FormHelper();


    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
    let i_service_f2 = '';
    const i_service_f3 = 'qmts30lc_pro';
    const i_service_f7 = 'qmts30lc_pro';
    const i_service_f8 = 'qmts30lc_pro';
    //导入存入表
    const i_service_f5 = 'qmts30lh_add';
    const i_factory_div = 'S2N';

    // 自定义grid工具栏按钮是否可用
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
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => { });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => { });
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab1.value);
      erFormHelper.setGridEditable(gridView_tab1.value, false); // 设置grid不可编辑
      erFormHelper.setGridToolbarVisible(gridView_tab1.value, {
        excel: true
      });
    };

    //自定义模板参数
    const popFreeEdit_pars = async (Click_name: string) => {
      if (cs_OkClick === 'F3') {
        //popFreeEdit.AllowEidt = true;
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTS30_LAYOUT_DIALOG1');
      }
      if (cs_OkClick === 'F7') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTS30_LAYOUT_DIALOG2');
      }
      if (cs_OkClick === 'F8') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTS30_LAYOUT_DIALOG3');
      }
    };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      if (cs_OkClick === 'F3') {
        i_service = i_service_f3;
      } else if (cs_OkClick === 'F7') {
        i_service = i_service_f7;
      } else if (cs_OkClick === 'F8') {
        i_service = i_service_f8;
      }

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1'));
      inInfo.addBlock(erFormHelper.buildEiBlock([{
        RES_PROCESS: e.dataModel.RES_PROCESS,
        REJUDGE_STEEL: e.dataModel.REJUDGE_STEEL,
        CIR_COMPONENT: e.dataModel.CIR_COMPONENT,
        MESSAGE_LIST: e.dataModel.MESSAGE_LIST,
        FINAL_OPINION: e.dataModel.FINAL_OPINION,
        NOTE: e.dataModel.NOTE,
        PRO_DIV: i_proc_div
      }]), 'PARA')
      console.log('inInfo', inInfo);

      outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };
    const query_main = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiInfo.addBlock(eiBlock, 'zx');
      console.log('wsl', eiBlock.data[0]["ZX_LS"]?.toString());
      if (eiBlock.data[0]["ZX_LS"]?.toString() == "1") {
        i_service_f2 = "qmts30lc_inq";
      } else {
        i_service_f2 = "qmts30lc_inq_ls";
      }

      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);
      }
    };

    const F2_DO = async () => {
      query_main();
    };
    const dialogFormVisible = ref(false);//是否打开弹出窗口
    const dialogFormName = ref(''); // 弹出画面的画面名
    const dialogFormName_title = ref(''); // 弹出画面的画面中文名
    const parentInfo = ref({}); // 给弹出画面传入数据
    const showDialog = () => {
      dialogFormVisible.value = true;
    };
    const handleClose = () => {
      dialogFormVisible.value = false;
    };
    const getChildInfo = (info: any) => {
      console.log("获取弹窗画面传递过来的信息", info);


      dialogFormVisible.value = false; // 关闭弹框
      handleClose();
      query_main();
      return true;

    };

    //F3点击事件：判定
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息！');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['STATUS_FLAG'] === "2") {
        erFormHelper.messageWarning('已审核不能判定！');
        return;
      }

      //获取选中行信息
      // const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];
      // cs_OkClick = 'F3';
      // i_proc_div = 'UPD';
      // popFreeEdit_pars(cs_OkClick);
      // popFreeEdit.ReceiveData(mainGridCheckedRow);
      // ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      const data = {
        LayoutName: 'QMTS30_LAYOUT_DIALOG1',
        callService: 'qmts30lc_pro',
        mainData: erFormHelper.getGridCheckedRowsAsBlock('GridView1')
      };
      dialogFormName.value = 'QMBSCZS2N'; // 读配置表获取画面名
      dialogFormName_title.value = '成分不合判定';
      //console.log('fcfghuijn', data.mainData)
      parentInfo.value = data;
      showDialog();
    }

    //F4点击事件：审核
    const F4_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息！');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['STATUS_FLAG'] === "0") {
        erFormHelper.messageWarning('为经判定不能审核！');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被审核， 是否继续？');
      if (!mes_res) {
        return false;
      }

      //获取选中行信息
      inInfo.addBlock(
        erFormHelper.getGridCheckedRowsAsBlock('GridView1', {
          PRO_DIV: 'USH',
        })
      );
      outInfo = await erFormHelper.callService("qmts30lc_pro", inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };

    //F5点击事件：导入
    const F5_PRE_DO = async (e: any) => {
      // 设置工具栏按钮可见
      setToolbarVisible1(gridView_tab1.value, true);
    }
    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      setToolbarVisible2(gridView_tab1.value, true);

      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择要导入的信息！');
        return false;
      }
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('GridView1'));
      console.log('inInfo', inInfo);

      outInfo = await erFormHelper.callService(i_service_f5, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();



    }
    const F5_CANCEL = async (e: any) => {
      setToolbarVisible2(gridView_tab1.value, true);
      query_main();
    }
    const F6_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择信息进行处置关闭！');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被处置关闭， 是否继续？');
      if (!mes_res) {
        return false;
      }
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('GridView1'));
      outInfo = await erFormHelper.callService("qmts30lh_del", inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };
    const F7_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息！');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['STATUS_FLAG'] === "2") {
        erFormHelper.messageWarning('已审核不能驳回！');
        return false;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['STATUS_FLAG'] === "-3") {
        erFormHelper.messageWarning('已驳回3次不可在驳回！');
        return false;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];

      cs_OkClick = 'F7';
      i_proc_div = 'BH';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        ST_NO: true,
        HEAT_NO: true,
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F8_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息！');
        return;
      }
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];

      cs_OkClick = 'F8';
      i_proc_div = 'PY';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        ST_NO: true,
        HEAT_NO: true,
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F9_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择信息进行成品处置！');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被成品处置， 是否继续？');
      if (!mes_res) {
        return false;
      }
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('GridView1'));
      outInfo = await erFormHelper.callService("qmts30lh_cp_cz", inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };



    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      LayoutGroupFilter,
      gridView_tab1,
      F2_DO,
      erGrid1Ready,
      F3_DO,
      F4_DO,
      F5_PRE_DO,
      F5_DO,
      F5_CANCEL,
      F6_DO,
      F7_DO,
      F8_DO,
      F9_DO, dialogFormVisible, dialogFormName, dialogFormName_title, handleClose, parentInfo, getChildInfo
    };
  }
});
