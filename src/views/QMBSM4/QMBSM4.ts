import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";



export default defineComponent({
  name: 'QMBSM4',
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
    let i_form_ename = ""; // 低代码配置画面布局名
    let formPartition: string;
    let formName: "";
    let PROGRAM_NAME: string;
    let LayoutGroupFilter = 'LayoutGroupFilter';
    let LayoutGroupFilter1 = 'LayoutGroupFilter1';
    const grid_view_1 = ref('GridView1');
    const gridView_chemi_std = ref('GridView2');
    const gridToolbar: Ref<any[]> = ref([]);
    let gridView1!: any;
    let grid_chemi_std!: any;


    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams["PROGRAM_NAME"];
      }
      initializePage();
    };

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    const initializeService = '';
    const flag = ref('T');
    let tab1ActiveKey = ref('tab1');
    let pagePara: any; // 炼钢配置表页面参数


    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false },
      });
    };

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

        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridColumnEditable(gridView_chemi_std, false);
          erFormHelper.setControlEnable('LayoutGroupFilter1', false);
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
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      console.log('grid_view_1', grid_view_1);
      erFormHelper.setGridToolbarVisible(grid_view_1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      grid_chemi_std = erFormHelper.getGrid(gridView_chemi_std.value);
      erFormHelper.setGridToolbarVisible(gridView_chemi_std.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const handleTabChange = (activeKey: string) => {
      const selectedRows = erFormHelper.getGridSelectRows('GridView1', false);
      if (activeKey === 'tab1') {
        getSubGridLine(selectedRows[0]);
      } else if (activeKey === 'tab2') {
        getSubGridLine(selectedRows[0]);
      }
    };


    const query = async () => {
      const inInfo = new EI.EIInfo();
      //自定义分页
      erFormHelper.setGridServerPagingQuery('GridView1', inInfo, (queryPage: number) => {
        return new Promise(async (resolve, reject) => {
          const inInfo = new EI.EIInfo();
          //查询条件
          const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
          inInfo.addBlock(eiBlock, "infogrid" + queryPage);
          const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
          const grid = erFormHelper.getGrid('GridView1');
          const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
          inInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize, tableName: 'T' + efFormInfo.value.formParams['table_name'] }], 'PAGEINFO'));
          await erFormHelper.callService(efFormInfo.value.formParams["service"], inInfo).then((res: any) => {
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;

              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
              getSubGridLine(res.getBlock(0).data);
            }
          });
          resolve(result);
        });
      });
      erFormHelper.setGridEditable("GridView1", false);
    };

    //焦点行
    const gridView1FocusChanged = (e: any) => {
      if (e.data) {
        getSubGridLine(e.data);
      }
    };

    //查询制造标准信息
    const getSubGridLine = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('ST_NO');
      eiBlock.addRow({
        ST_NO: e.ST_NO
      });
      const eiblock2 = eiInfo.addBlock(new EI.EiBlock(), 'table_temp');
      eiblock2.addColumn('table_name');
      eiblock2.addRow({
        table_name: 'T' + efFormInfo.value.formParams["table_name"]
      });

      console.log(eiInfo, '制造标准成分eiInfo');
      const outInfo = await erFormHelper.callService('qmtsm_elm_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageInfo(outInfo.sys.msg);
        return;
      }
      erFormHelper.clearLayoutData('LayoutGroupFilter1');
      if (outInfo.getBlock(0).data.length > 0) {
        let list = {};
        list = outInfo.getBlock(0).data[0];
        erFormHelper.setControlValueEx('LayoutGroupFilter1', list);
      }
      erFormHelper.mergeDataToGrid(outInfo.getBlock(1), gridView_chemi_std.value);
      //grid_chemi_std.refresh();
    };

    //查询
    const F2_DO = async (e: any) => {
      query();
    };

    return {
      erFormHelper,
      initializeFlag,
      LayoutGroupFilter,
      gridToolbar,
      grid_view_1,
      tab1ActiveKey,
      gridView_chemi_std,
      LayoutGroupFilter1,
      handleTabChange,
      erGrid1Ready,
      erGrid2Ready,
      efFormReady,
      F2_DO,
      gridView1FocusChanged
    };
  }
});
