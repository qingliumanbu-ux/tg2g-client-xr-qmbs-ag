import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { EFDialogFormMessage } from 'EFX/EFDialogForm';
import { log } from 'console';
export default defineComponent({
  name: 'QMBS25S',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: "";
    let PROGRAM_NAME: string;
    let i_form_ename = ""; // 低代码配置画面布局名
    let gridView1!: any;
    let gridView2!: any;
    let gridView3!: any;
    let QUA_NO: any;
    const grid_view_1 = ref('gridView1');
    const grid_view_2 = ref('gridView2');
    const grid_view_3 = ref('gridView3');

    const initializeService = 'qmts_form_get';

    const editable = ref(false);

    let s_heat_no = '';
    const function_id = ref(0);

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

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        i_form_ename,
        initializeService
      );
      if (initialResult.flag > 0) {
        initializeFlag.value = 1;

        // 初始化工具栏
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

    //试样成分查询
    const p_query_qmts02 = async () => {
      const eiInfo = new EI.EIInfo();
      try {
        const eiblock = eiInfo.addBlock(new EI.EiBlock(), 'query_where');
        eiblock.addColumns('HEAT_NO', 'ST_SAMPLE_NO', 'WHOLE_BACKLOG_CODE');
        const currentRow = erFormHelper.getGridCurrentRowAsBlock('gridView2');

        if (currentRow.data.length < 1) {
          return;
        } else {
          eiblock.addRow({
            HEAT_NO: currentRow.data[0].HEAT_NO,
            ST_SAMPLE_NO: currentRow.data[0].ST_SAMPLE_NO,
            WHOLE_BACKLOG_CODE: currentRow.data[0].STATION_ID
          });

          const outInfo = await erFormHelper.callService('qmbs25s_inqe', eiInfo);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageInfo(outInfo.sys.msg);
            return;
          }
          if (outInfo.getBlock(0).data.length > 0) {
            erFormHelper.mergeDataToGrid(outInfo.getBlock(0).data, 'gridView3');
          } else {
            erFormHelper.clearGridData('gridView3');
            return;
          }
        }
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
        return;
      }
    };

    //工序试样查询
    const p_query_qmts25 = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const eiblock = eiInfo.addBlock(new EI.EiBlock(), 'query_where');
        const lian_zhu_no = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter').data[0]["LIAN_ZHU_NO"];
        console.log('789', lian_zhu_no);
        eiblock.addColumn('HEAT_NO');
        eiblock.addColumn('LIAN_ZHU_NO');
        if (e.HEAT_NO === '') {
          return;
        } else {
          eiblock.addRow({
            HEAT_NO: e.HEAT_NO,
            LIAN_ZHU_NO: lian_zhu_no,
          });
        }
        const outInfo = await erFormHelper.callService('qmbs25s_inqs', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return;
        }
        if (outInfo.getBlock(0).data.length > 0) {
          erFormHelper.mergeDataToGrid(outInfo.getBlock(0).data, 'gridView2');
          p_query_qmts02();
        } else {
          erFormHelper.clearGridData('gridView2');
          erFormHelper.clearGridData('gridView3');
          return;
        }
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
        return;
      }
    };

    //炉次查询
    const p_query_pssm11 = async () => {
      const inInfo = new EI.EIInfo();
      //自定义分页
      erFormHelper.setGridServerPagingQuery('gridView1', inInfo, (queryPage: number) => {
        console.log('234');
        return new Promise(async (resolve, reject) => {
          const inInfo = new EI.EIInfo();
          //查询条件
          const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
          inInfo.addBlock(eiBlock, "infogrid" + queryPage);
          const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
          const grid = erFormHelper.getGrid('gridView1');
          const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
          inInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
          await erFormHelper.callService('qmbs25s_h5_inq', inInfo).then((res: any) => {
            console.log('563', res.sys.status);
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;
              erFormHelper.mergeDataToGrid(res.getBlock(0).data, 'gridView1');

              erFormHelper.messageInfo('查询到' + res.getBlock(0).data.length + '条记录。');
              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
            } else {
              erFormHelper.clearGridData('gridView1');
              erFormHelper.clearGridData('gridView2');
              erFormHelper.clearGridData('gridView3');
              erFormHelper.messageInfo('没有满足条件的记录。');
              return;
            }
          });
          resolve(result);
        });
      });
      erFormHelper.setGridEditable("gridView1", false);
    };

    //设置编辑状态
    const p_edit_set = () => {
      if (function_id.value === 3 || function_id.value === 4) {
        erFormHelper.setGridEnable('gridView3', true);
        gridView3.unbind('beforeEdit');
        gridView3.bind('beforeEdit', (e: any) => {
          const currentFiels = e.sender.columns[e.sender.cellIndex(e.sender.current())].field;
          if (currentFiels !== 'ELM_ACT') {
            e.preventDefault();
          }
        });
      } else {
        erFormHelper.setGridEnable('gridView3', true);
      }
    };

    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
      erFormHelper.setGridToolbarVisible(grid_view_1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      erFormHelper.setGridEditable(grid_view_2.value, false); // 设置grid不可编辑
      erFormHelper.setGridToolbarVisible(grid_view_2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid(grid_view_3.value);
      //erFormHelper.setGridEditable(grid_view_3.value, false); // 设置grid不可编辑
      gridView3.gridOptions.getRowStyle = (params: any) => {
        if (params.data.ELM_OK.toString().trim() == '1') {
          return {
            fontweight: 'bold',
            background: '#F78084'
          };
        }
      };
      erFormHelper.setGridToolbarVisible(grid_view_3.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    //F2查询
    const f2Do = () => {
      p_query_pssm11();
    };
    const sim_elm_act = (gridview: any) => {
      try {
        const inInfo = new EI.EIInfo();
        inInfo.addBlock(erFormHelper.getGridRowsAsBlock('gridView3', 'all'));
        console.log(inInfo);
        for (let k = 0; k < inInfo.blocks["Table1"].data.length; k++) {
          inInfo.blocks["Table1"].data[k]['ELM_ACT'] = inInfo.blocks["Table1"].data[k]['MAIN_AIM'];
        }
        erFormHelper.mergeDataToGrid(inInfo.getBlock(0).data, 'gridView3');
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
      }
    };

    //#region 新增
    //新增前
    const f3PreDo = (e: any) => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('gridView2');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
      erFormHelper.setGridEditable(grid_view_3.value, true); // 设置grid可编辑
      sim_elm_act(gridView2 = erFormHelper.getGrid('gridView2'));
      erFormHelper.messageInfo('确认新增信息无误，方可点击确认键。若需取消操作请点击取消键。');
    };

    //新增
    const f3Do = async (e: any) => {
      try {
        const inInfo = new EI.EIInfo();
        await erFormHelper.stopGridEditing('gridView2', () => {
          inInfo.addBlock(erFormHelper.getGridCurrentRowAsBlock('gridView2'), 'TQMTS24');
        })
        await erFormHelper.stopGridEditing('gridView3', () => {
          inInfo.addBlock(erFormHelper.getGridRowsAsBlock('gridView3', 'all'));
        })
        inInfo.addBlock(erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter1'), 'AA');
        console.log(inInfo);
        const outInfo = await erFormHelper.callService('qmbs25s_ins', inInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError(outInfo.sys.msg);
          return false;
        }
        erFormHelper.messageInfo('新增成功。');
        p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
        //新增之后回到新增的试样号焦点行
        QUA_NO = outInfo.getBlock(0).data[0]["ST_SAMPLE_NO"];
        console.log("WSL", QUA_NO);
        nextTick(() => {
          erFormHelper.setGridIndicator(gridView2, { ST_SAMPLE_NO: QUA_NO });
        });
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
      }
    };

    //新增取消
    const f3Cancel = (e: any) => {
      function_id.value = 2;
      erFormHelper.setGridEditable(grid_view_2.value, false);
      erFormHelper.setGridEditable(grid_view_3.value, false);
      p_query_qmts02();

      erFormHelper.messageInfo('新增操作取消。');
    };
    //#endregion

    //#region 修改
    //修改前
    const f4PreDo = (e: any) => {
      const eiblock = erFormHelper.getGridSelectRowsAsBlock('gridView2');
      if (eiblock.data.length < 1) {
        erFormHelper.messageInfo('没有选中数据。');
        return;
      }
      erFormHelper.setGridEditable(grid_view_3.value, true); // 设置grid可编辑
      erFormHelper.messageInfo('确认修改信息无误，方可点击确认键。若需取消操作请点击取消键。');
    };

    //修改
    const f4Do = async (e: any) => {
      try {
        const inInfo = new EI.EIInfo();
        await erFormHelper.stopGridEditing('gridView2', () => {
          inInfo.addBlock(erFormHelper.getGridCurrentRowAsBlock('gridView2'), 'TQMTS24');
        })
        await erFormHelper.stopGridEditing('gridView3', () => {
          inInfo.addBlock(erFormHelper.getGridRowsAsBlock('gridView3', 'all'));
        })
        console.log(inInfo);
        const outInfo = await erFormHelper.callService('qmbs25s_upd', inInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError(outInfo.sys.msg);
          return false;
        }
        erFormHelper.messageInfo('修改成功。');
      } catch (ex: any) {
        erFormHelper.messageInfo(ex.message);
      }
    };

    //修改取消
    const f4Cancel = (e: any) => {
      function_id.value = 2;
      erFormHelper.setGridEditable(grid_view_2.value, true);
      erFormHelper.setGridEditable(grid_view_3.value, true); // 设置grid可编辑
      p_edit_set();
      p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
      erFormHelper.messageInfo('修改操作取消。');
    };
    //#endregion

    //#region 删除
    //删除前
    const f5PreDo = (e: any) => {
      function_id.value = 5;
      p_edit_set();
      erFormHelper.messageInfo('确认删除信息无误，方可点击确认键。若需取消操作请点击取消键。');
    };

    //删除
    const f5Do = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView2');
        if (selectRows.data.length < 1) {
          erFormHelper.messageInfo('没有选中数据。');
          return false;
        }
        eiInfo.addBlock(selectRows);
        const outInfo = await erFormHelper.callService('qmts25s_del', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return false;
        }
        p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
        erFormHelper.messageInfo('删除成功。');
      } catch (ex: any) {
        erFormHelper.messageConfirm(ex.message);
        erFormHelper.messageInfo('系统出现异常，请联系系统维护人员。');
      }
      function_id.value = 2;
      p_edit_set();
    };

    //删除取消
    const f5Cancel = (e: any) => {
      function_id.value = 2;
      p_edit_set();
      p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
      erFormHelper.messageInfo('删除操作取消。');
    };
    //#endregion

    //判定
    const f6Do = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView2');
        if (selectRows.data.length < 1) {
          erFormHelper.messageInfo('没有选中数据。');
          return false;
        }
        eiInfo.addBlock(selectRows);
        const outInfo = await erFormHelper.callService('qmts25_chk', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return false;
        } else {
          p_query_pssm11();
          erFormHelper.messageInfo('判定成功。');
        }
      } catch (ex: any) {
        erFormHelper.messageConfirm(ex.message);
        erFormHelper.messageInfo('系统出现异常，请联系系统维护人员。');
      }
    };

    //代表成分取消
    const f11Do = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView2');
        if (selectRows.data.length < 1) {
          erFormHelper.messageInfo('没有选中数据。');
          return false;
        }
        eiInfo.addBlock(selectRows);
        const outInfo = await erFormHelper.callService('qmts25s_rep_unsel', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo(outInfo.sys.msg);
          return false;
        } else {
          p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
          erFormHelper.messageInfo('代表样取消成功。');
        }
      } catch (ex: any) {
        erFormHelper.messageConfirm(ex.message);
        erFormHelper.messageInfo('系统出现异常，请联系系统维护人员。');
        return false;
      }
    };

    //选择代表样
    const f12Do = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      try {
        const selectRows = erFormHelper.getGridSelectRowsAsBlock('gridView2');
        const currentRow = erFormHelper.getGridCurrentRowAsBlock('gridView2');
        if (selectRows.data.length < 1) {
          erFormHelper.messageInfo('没有选中数据。');
          return false;
        }
        if (currentRow.data[0].JUDGE_CODE !== '1') {
          const result = await erFormHelper.messageConfirm('选择的是不合格的成分');
          if (!result) {
            erFormHelper.messageInfo('取消操作');
            return false;
          } else {
            eiInfo.addBlock(selectRows);
            const outInfo = await erFormHelper.callService(
              'qmts25s_rep_sel',
              eiInfo
            );
            if (outInfo.sys.status < 0) {
              erFormHelper.messageInfo(outInfo.sys.msg);
              return false;
            } else {
              p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
              erFormHelper.messageInfo('代表样成功选定。');
            }
          }
        } else {
          eiInfo.addBlock(selectRows);
          const outInfo = await erFormHelper.callService('qmts25s_rep_sel', eiInfo);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageInfo(outInfo.sys.msg);
            return false;
          } else {
            p_query_qmts25(erFormHelper.getGridCurrentRow(grid_view_1.value));
            erFormHelper.messageInfo('代表样成功选定。');
          }
        }
      } catch (ex: any) {
        erFormHelper.messageConfirm(ex.message);
        erFormHelper.messageInfo('系统出现异常，请联系系统维护人员。');
        return false;
      }
    };

    //gridView_PSSM11 焦点行改变事件
    const gridView1FocusChanged = (e: any) => {
      if (e.data) {
        p_query_qmts25(e.data);
      }
    };

    //gridView_QMTS25 焦点行改变事件
    const gridView2FocusChanged = (e: any) => {
      if (e.data) {
        //回到新增的那个焦点行
        erFormHelper.checkGridCurrentRow(grid_view_2.value);
        p_query_qmts02();
      }
    };

    return {
      f2Do,
      f3PreDo,
      f3Do,
      f3Cancel,
      f4PreDo,
      f4Do,
      f4Cancel,
      f5PreDo,
      f5Do,
      f5Cancel,
      f6Do,
      f11Do,
      f12Do,
      erFormHelper,
      initializeFlag,
      editable,
      grid_view_1,
      grid_view_2,
      grid_view_3,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      gridView1FocusChanged,
      gridView2FocusChanged
    };
  }
});
