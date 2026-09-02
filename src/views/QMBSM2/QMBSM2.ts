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
import Dibei from "../../components/DiBei.vue"
import DiBei_NQ from "../../components/DiBei_NQ.vue"

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import axios from 'axios';



export default defineComponent({
  name: 'QMBSM2',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    Dibei,
    DiBei_NQ,
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
    let grid_jain!: any;
    const gridView_main = ref('gridView_main');
    const gridView_Jain = ref('gridView_Jain');
    let gridView_single = 'gridView_single';
    const initializeService = 'qmts_form_get';
    let tab1ActiveKey = ref('tab1');


    let cs_OkClick = '';
    let i_proc_div = '';
    const i_service_f3 = 'qmts27_add';
    const i_service_f4 = 'qmts27_upd';
    let popFreeEdit: ER.PopFreeHelper;
    const formData = {
      heat_no: '',
      st_no: '',
      mat_no: '',
      mat_thick: '',
      dev_code: '',
      c_div: '',
      area: '',
      center_sgrg_porosity: '',
      crack_center: '',
      equiaxed_grain_percentage_r: '',
      equiaxed_grain_width: '',
      tri_crack_grade: '',
      angle_crack_grade: '',
      transverse_internal_crack: '',
      longitudinal_internal_crack: '',
      other_defects_description: '',
      crack: '',
      inner_arc_width: '',
      outter_arc_width: '',
      centre_thickness: '',
      edge_thickness: '',
      reference_standard: '',
      check_maker: '',
      test_procedure: '',
      sample_maker: '',
    }

    function loadFile(url: any, callback: any) {
      PizZipUtils.getBinaryContent(url, callback);
    }

    const renderDoc = async (data: any) => {
      loadFile("http://10.162.72.16:10004/WordTemplate/低倍硫印模板.docx", function(
        error: any,
        content: any
      ) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        doc.render(data);

        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // Output the document using Data-URI
        const fileName = erFormHelper.getGridSelectRowsAsBlock('gridView_main').data[0]["MAT_NO"] + "_低倍硫印.docx";
        saveAs(out, fileName);
      });
    }

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
      grid_jain = erFormHelper.getGrid(gridView_Jain.value);
      erFormHelper.setGridToolbarVisible(gridView_Jain.value, {
        addrow: false,
        copyrow: false,
        excel: true,
        delete: false
      });
    };
    const erGrid2Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_main.value);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        excel: true,
        delete: false
      });
    };
    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        querywl();
      } else if (activeKey === 'tab2') {
        querydb();
      }
    };
    //查询物料信息
    const querywl = async () => {
      const inInfo = new EI.EIInfo();
      //自定义分页
      erFormHelper.setGridServerPagingQuery('gridView_Jain', inInfo, (queryPage: number) => {
        return new Promise(async (resolve, reject) => {
          const inInfo = new EI.EIInfo();
          //查询条件
          const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
          inInfo.addBlock(eiBlock, "infogrid" + queryPage);
          const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
          const grid = erFormHelper.getGrid('gridView_Jain');
          const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
          inInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize, tableName: 'VMMSM01' }], 'PAGEINFO'));
          await erFormHelper.callService('qmtsh5_inq', inInfo).then((res: any) => {
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
      erFormHelper.setGridEditable("gridView_Jain", false);
    };
    //查询低培信息
    const querydb = async () => {
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
      erFormHelper.setGridEditable("gridView_main", false);
    };
    //自定义模板参数
    const popFreeAdd = new ER.PopFreeHelper(
      efFormInfo.value.formPartition,
      'QMTS27POP',
      'QMTS_POP_LAYOUT',
      ''
    )

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      let blockname = '';
      if (e == 'I') blockname = 'QMTS27_ADD';
      if (e == 'U') blockname = 'QMTS27_MODIFY';

      inInfo.addBlock(erFormHelper.convertModelAsBlock(popFreeAdd.DataModel), blockname);

      outInfo = await erFormHelper.callService('qmts27_pro', inInfo, false, true);
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
      querywl();
    };
    //焦点行数据查询
    const gridView_main_focuse_changed = (e: any) => {
      if (e.data) {
        getSubGridLine(e.data);
      }
    };

    //低培单记录
    const getSubGridLine = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('MAT_NO');
      eiBlock.addRow({
        MAT_NO: e.MAT_NO,
      });
      const eiblock2 = eiInfo.addBlock(new EI.EiBlock(), 'table_temp');
      eiblock2.addColumn('tableName');
      eiblock2.addRow({
        tableName: 'TQMTS27'
      });
      const outInfo = await erFormHelper.callService('qmts27_inqv', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      }
      erFormHelper.clearLayoutData('gridView_single');
      erFormHelper.setControlValueEx('gridView_single', outInfo.getBlock(0).data[0]);
    };
    const dp_inq = async (e: any) => {
      if (e.length < 1) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'condition');
      eiBlock.addColumns('MAT_NO');
      eiBlock.addRow({
        MAT_NO: e.MAT_NO,
      });
      const eiblock2 = eiInfo.addBlock(new EI.EiBlock(), 'table_temp');
      eiblock2.addColumn('tableName');
      eiblock2.addRow({
        tableName: 'T' + efFormInfo.value.formParams["table_name"]
      });
      const outInfo = await erFormHelper.callService('qmts27_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('提示错误:' + outInfo.sys.msg);
        return;
      } else {
        i_proc_div = 'I';
        const selectedRows = erFormHelper.getGridSelectRows('gridView_Jain', false);
        //查询低培信息中是否有这个材料号，有则不可新增提示
        popFreeAdd.ReceiveData(selectedRows[0]);
        ER.PopUtils.showErPopFree(ErPopFree, popFreeAdd, (e: any) => {
          if (popFreeAdd.getEvent('ok')) {
            popFreeEditOkClick(i_proc_div);
          }
          if (popFreeAdd.getEvent('cancel')) {
            popFreeAdd.CloseDialog();
          }
        })
      }
    };

    const F2_DO = async () => {
      querywl();
      querydb();
    };
    const F3_DO = async () => {
      if (erFormHelper.getGridCheckedRows('gridView_Jain').length === 0) {
        erFormHelper.messageWarning('请选择一条物料信息再新增！');
        return false;
      }
      i_proc_div = 'I';
      const currentRow = erFormHelper.getGridCheckedRowsAsBlock('gridView_Jain');
      //查询低培信息中是否有这个材料号，有则不可新增提示
      // dp_inq(selectedRows[0]);
      if (currentRow.data.length < 1) {
        return;
      }
      formData.mat_no = currentRow.data[0].MAT_NO as string;
      formData.st_no = currentRow.data[0].ST_NO as string;
      formData.heat_no = currentRow.data[0].HEAT_NO as string;
      formData.mat_thick = currentRow.data[0].MAT_THICK as string;
      formData.dev_code = currentRow.data[0].DEV_CODE as string;
      formData.c_div = currentRow.data[0].C_DIV as string;
      formData.area = "北";
      dialogFormVisible.value = true;
    };

    const F4_DO = async (e: any) => {
      const currentRow = erFormHelper.getGridCheckedRowsAsBlock('gridView_main');
      if (currentRow.data.length < 1) {
        erFormHelper.messageWarning('请选择一条低培信息再修改！');
        return;
      }
      formData.mat_no = currentRow.data[0].MAT_NO as string;
      formData.st_no = currentRow.data[0].ST_NO as string;
      formData.heat_no = currentRow.data[0].HEAT_NO as string;
      formData.mat_thick = currentRow.data[0].MAT_THICK as string;
      formData.dev_code = currentRow.data[0].DEV_CODE as string;
      formData.c_div = currentRow.data[0].C_DIV as string;
      formData.area = currentRow.data[0].AREA as string;
      formData.center_sgrg_porosity = currentRow.data[0].CENTER_SGRG_POROSITY as string;
      formData.crack_center = currentRow.data[0].CRACK_CENTER as string;
      formData.equiaxed_grain_percentage_r = currentRow.data[0].EQUIAXED_GRAIN_PERCENTAGE_R as string;
      formData.equiaxed_grain_width = currentRow.data[0].EQUIAXED_GRAIN_WIDTH as string;
      formData.tri_crack_grade = currentRow.data[0].TRI_CRACK_GRADE as string;
      formData.angle_crack_grade = currentRow.data[0].ANGLE_CRACK_GRADE as string;
      formData.transverse_internal_crack = currentRow.data[0].TRANSVERSE_INTERNAL_CRACK as string;
      formData.longitudinal_internal_crack = currentRow.data[0].LONGITUDINAL_INTERNAL_CRACK as string;
      formData.other_defects_description = currentRow.data[0].OTHER_DEFECTS_DESCRIPTION as string;
      formData.crack = currentRow.data[0].CRACK as string;
      formData.inner_arc_width = currentRow.data[0].INNER_ARC_WIDTH as string;
      formData.outter_arc_width = currentRow.data[0].OUTTER_ARC_WIDTH as string;
      formData.centre_thickness = currentRow.data[0].CENTRE_THICKNESS as string;
      formData.edge_thickness = currentRow.data[0].EDGE_THICKNESS as string;
      formData.reference_standard = currentRow.data[0].REFERENCE_STANDARD as string;
      formData.check_maker = currentRow.data[0].CHECK_MAKER as string;
      formData.sample_maker = currentRow.data[0].SAMPLE_MAKER as string;
      formData.test_procedure = currentRow.data[0].TEST_PROCEDURE as string;
      dialogFormVisible.value = true;
    };
    const removeFile = async (fileName: string) => {
      try {
        const response = await axios.delete(`http://10.162.72.16:10004/delete/${encodeURIComponent(fileName)}`);

      } catch (error) {
        console.error('Error during file deletion:', error);
      }
    }
    const F5_DO = async () => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('gridView_main').length === 0) {
        erFormHelper.messageWarning('请选择一条低培信息再删除');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
      if (!mes_res) {
        return false;
      }
      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('gridView_main'),
        'QMTS27_DEL'
      );
      const outInfo = await erFormHelper.callService('qmts27_pro', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        //删除在服务器上的图片
        const fileName = erFormHelper.getGridSelectRowsAsBlock('gridView_main').data[0]["MAT_NO"] + "_DB.png";
        removeFile(fileName as string);
        querydb();
      }
    };
    const F6_DO = async () => {
      const inInfo = new EI.EIInfo();
      if (tab1ActiveKey.value === "tab1") {
        inInfo.addBlock(erFormHelper.getGridCurrentRowAsBlock('gridView_Jain'), 'MAT_MESSAGE');
      }
      else {
        inInfo.addBlock(erFormHelper.getGridCurrentRowAsBlock('gridView_main'), 'MAT_MESSAGE');
      }
      const outInfo = await erFormHelper.callService('qmts27_mat_detail', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      }
      renderDoc(outInfo.getBlock(0).data[0]);
    }

    const dialogFormVisible = ref(false);
    const dialogFormVisible1 = ref(false);
    const handleFormSubmitted = async (data: any) => {
      const value = toRaw(data);

      const inInfo = new EI.EIInfo();
      const inBlock = inInfo.addBlock(new EI.EiBlock(), 'QMTS27_ADD');

      for (let item in value) {
        inBlock.addColumns(item);
      }
      inBlock.addRow(
        value);
      let outInfo = await erFormHelper.callService('qmts27_pro', inInfo, false, true);
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
    }
    const showDialog = () => {
      dialogFormVisible.value = true;
    }
    const handleClose = () => {
      dialogFormVisible.value = false;
      dialogFormVisible1.value = false;
    }
    const F7_DO = async () => {
      formData.mat_no = " ";
      formData.st_no = " ";
      formData.heat_no = " ";
      formData.mat_thick = " ";
      formData.dev_code = " ";
      formData.c_div = " ";
      formData.area = " ";
      formData.center_sgrg_porosity = " ";
      formData.crack_center = " ";
      formData.equiaxed_grain_percentage_r = " ";;
      formData.equiaxed_grain_width = " ";
      formData.tri_crack_grade = " ";
      formData.angle_crack_grade = " ";
      formData.transverse_internal_crack = " ";
      formData.longitudinal_internal_crack = " ";
      formData.other_defects_description = " ";
      formData.crack = " ";
      formData.inner_arc_width = " ";
      formData.outter_arc_width = " ";
      formData.centre_thickness = " ";
      formData.edge_thickness = " ";
      formData.reference_standard = " ";
      formData.check_maker = " ";
      formData.sample_maker = " ";
      formData.test_procedure = " ";
      formData.area = "南";
      dialogFormVisible1.value = true;
    };


    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO, F7_DO,
      tab1ActiveKey,
      handleTabChange,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      gridView_main,
      gridView_Jain,
      gridView_single,
      gridView_main_focuse_changed,
      dialogFormVisible,
      dialogFormVisible1,
      handleFormSubmitted,
      showDialog,
      handleClose,
      formData,
    };
  }
});
