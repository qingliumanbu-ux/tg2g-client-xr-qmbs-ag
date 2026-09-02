import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";

export default defineComponent({
  name: 'QMBS21',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
  },
  setup: () => {
    // 变量定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ""; // 低代码配置画面布局名
    let formPartition: string;
    let formName: "";
    let PROGRAM_NAME: string;
    let LayoutGroupFilter = 'LayoutGroupFilter';
    let LayoutGroupFilter1 = 'LayoutGroupFilter1';
    const gridView_line1 = ref('GridView1');
    const gridView_line2 = ref('GridView2');
    const gridView_line3 = ref('GridView3');
    const gridView_line4 = ref('GridView4');

    let gridView1!: any;
    let gridView2!: any;
    let gridView3!: any;
    let gridView4!: any;


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



    // 变量定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const initializeService = '';

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(gridView_line1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false },
      });
    }


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
          // 获取画面上的主要控件信息
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
      gridView1 = erFormHelper.getGrid(gridView_line1.value);
      console.log('gridView_line1', gridView1);
      erFormHelper.setGridToolbarVisible(gridView_line1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(gridView_line2.value);
      erFormHelper.setGridToolbarVisible(gridView_line2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid(gridView_line3.value);
      erFormHelper.setGridToolbarVisible(gridView_line3.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid4Ready = () => {
      gridView4 = erFormHelper.getGrid(gridView_line4.value);
      erFormHelper.setGridToolbarVisible(gridView_line4.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    //查询炉次信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('qmts21_inq_23', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line1.value);
      }
    };
    //判定结果 TQMTS24
    const getSubGridList = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('heat_no');
      eiBlock.addRow({
        heat_no: e.HEAT_NO
      });
      const outInfo = await erFormHelper.callService('qmts21m_inq_24', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line2.value);
      }
    };
    //炉次信息焦点行查询材料信息
    const gridView1FocusChanged = (e: any) => {
      if (e.data) {
        getSubGridM(e.data);
        getSubGridList(e.data);
      }
    };
    //实绩成分信息焦点行查询工序成分信息
    const gridView2FocusChanged = (e: any) => {
      if (e.data) {
        getSubGrid25(e.data);
      }
    };

    //查询工序成分信息 TQMTS25
    const getSubGrid25 = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('heat_no', 'st_sample_no');
      eiBlock.addRow({
        heat_no: e.HEAT_NO,
        st_sample_no: e.ST_SAMPLE_NO
      });
      const outInfo = await erFormHelper.callService('qmts21m_inq_25', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line3.value);
      }
    };

    //查询材料信息
    const getSubGridM = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('heat_no');
      eiBlock.addRow({
        heat_no: e.HEAT_NO
      });
      const outInfo = await erFormHelper.callService('qmts21_inq_sm', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line4.value);
      }
    };

    const F2_DO = async (e: any) => {
      getSubGridLine();
    };
    const F3_DO = async (e: any) => {
      const fin_st_no: string = erFormHelper.getControlValue('LayoutGroupFilter1', 'FIN_ST_NO');
      console.log(fin_st_no);
      if (fin_st_no.trim() === '') {
        erFormHelper.messageError('请输入最终出钢记号');
        return false;
      }
      const inInfo = new EI.EIInfo();
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
      const eiBlock = inInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('heat_no', 'fin_st_no');
      eiBlock.addRow({
        heat_no: mainGridCheckedRow.HEAT_NO,
        fin_st_no: fin_st_no
      });
      const outInfo = await erFormHelper.callService('qmts21_final_jud', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('发生错误:' + outInfo.sys.msg);
        return false;
      }
      getSubGridLine();
    };
    const F3_PRE_DO = async (e: any) => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
    };
    const F3_CANCEL = async (e: any) => {
      erFormHelper.messageInfo('操作取消。');
    };
    const F4_DO = async (e: any) => {
      const fin_st_no: string = erFormHelper.getControlValue('LayoutGroupFilter1', 'FIN_ST_NO');
      if (fin_st_no.trim() === '') {
        erFormHelper.messageError('请输入最终出钢记号');
        return false;
      }
      const inInfo = new EI.EIInfo();
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line4.value, true)[0]; // 获取主表勾选行
      const eiBlock = inInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('mat_no', 'fin_st_no');
      eiBlock.addRow({
        mat_no: mainGridCheckedRow.MAT_NO,
        fin_st_no: fin_st_no
      });
      const outInfo = await erFormHelper.callService('qmts21_mmgp', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('发生错误:' + outInfo.sys.msg);
        return false;
      }
      getSubGridLine();

    };
    const F4_PRE_DO = async (e: any) => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('GridView4');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
    };
    const F4_CANCEL = async (e: any) => {
      erFormHelper.messageInfo('操作取消。');
    };

    return {
      erFormHelper,
      initializeFlag,
      LayoutGroupFilter,
      LayoutGroupFilter1,
      gridView_line1,
      gridView_line2,
      gridView_line3,
      gridView_line4,
      gridView1FocusChanged,
      gridView2FocusChanged,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      erGrid4Ready,
      efFormReady,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL
    };
  }
});
