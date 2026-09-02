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

export default defineComponent({
  name: 'QMTSCBS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
    ErPopFree
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
    let i_service_f2 = '';
    let i_service_f7 = '';
    //导入存入表
    let i_service_f5 = '';
    let i_service_f6 = '';
    let i_xg_type = '';
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
      i_service_f2 = efFormInfo.value.formParams['service'];
      i_service_f7 = efFormInfo.value.formParams['service7'];
      i_service_f5 = efFormInfo.value.formParams['service5'];
      i_service_f6 = efFormInfo.value.formParams['service6'];
      i_xg_type= efFormInfo.value.formParams['xg_type'];
      initializePage();
    };
    const erFormHelper: ER.FormHelper = new ER.FormHelper();


    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
   
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
    const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
    if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
      initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
      nextTick(() => {});
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
     
      if (cs_OkClick === 'F7') {
        if(i_xg_type=== '00')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB00_DIALOG3');
        }
        console.log('test', i_xg_type);
        if(i_xg_type=== '01')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB01_DIALOG3');
        }
        if(i_xg_type=== '02')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB02_DIALOG3');
        }
        if(i_xg_type=== '03')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB03_DIALOG3');
        }
        if(i_xg_type=== '04')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB04_DIALOG3');
        }
        if(i_xg_type=== '05')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB05_DIALOG3');
        }
        if(i_xg_type=== '06')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB06_DIALOG3');
        }
        if(i_xg_type=== '07')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALO', 'QMTSCB07_DIALOG3');
        }
        if(i_xg_type=== '08')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTSCB08_DIALOG3');
        }
        if(i_xg_type=== '09')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTSCB09_DIALOG3');
        }
        if(i_xg_type=== '10')
        {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'QMTS_DIALOG', 'QMTSCB10_DIALOG3');
        }
      }

    };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
     if (cs_OkClick === 'F7') {
        i_service = i_service_f7;
      }

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          FACTORY_DIV: i_factory_div,
          PRO_DIV: i_proc_div,
        }),
        'PARA'
      );


      console.log('inInfo', inInfo);

      outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };
    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        query_main();
      }
    };
    const query_main = async () => {
      const eiInfo = new EI.EIInfo();
      i_proc_div =i_xg_type;
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter, {
        FACTORY_DIV: i_factory_div,
        PRO_DIV: i_proc_div,
      });
      
      eiInfo.addBlock(eiBlock, '');
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
      i_proc_div =i_xg_type;
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('GridView1', {
        FACTORY_DIV: i_factory_div,
        PRO_DIV: i_proc_div,
      }), 'PARA'
      );
     
      // const mainGridCheckedRow = erFormHelper.getGridCurrentRow('GridView1');
      // inInfo.addBlock(
      //   mainGridCheckedRow, 'TQMTS30_ADD'
      //   );

      console.log('inInfo', inInfo);

      outInfo = await erFormHelper.callService(i_service_f5, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      else
      {
        erFormHelper.messageWarning('数据重复，操作失败！');
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
        erFormHelper.messageWarning('请选择需要删除的信息！');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被删除， 是否继续？');
      if (!mes_res) {
        return false;
      }

      i_proc_div =i_xg_type;
      //获取选中行信息
      inInfo.addBlock(erFormHelper.getGridCheckedRowsAsBlock('GridView1', {
        FACTORY_DIV: i_factory_div,
        PRO_DIV: i_proc_div,
      }), 'PARA'
      );
     
      outInfo = await erFormHelper.callService(i_service_f6, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query_main();
    };
    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息！');
        return;
      }
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];

      cs_OkClick = 'F7';
      i_proc_div =i_xg_type;
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    
    
    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      LayoutGroupFilter,
      gridView_tab1,
      F2_DO,
      erGrid1Ready,
      F5_PRE_DO,
      F5_DO,
      F6_DO,
      F5_CANCEL,
      F7_DO
    };
  }
});
