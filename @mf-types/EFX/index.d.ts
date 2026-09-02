// declare module "EFX/*";
///<reference types="../EIX" />
declare module "EFX/agPaginationPanel" {
  const _default: import("vue").DefineComponent<{}, {
    gridApi: any;
    paginationParams: any;
    pageSizesOptions: import("vue").Ref<number[]>;
    pageSizes: any;
    totalPages: any;
    currentPages: any;
    totalCount: any;
    isPagination: import("vue").Ref<boolean>;
    onPageSizeChanged: () => void;
    onPageChanged: () => void;
    refreshPagination: () => void;
    toFirst: () => void;
    toLast: () => void;
    toPre: () => void;
    toNext: () => void;
    handlePageChange: () => void;
    firstDisabled: import("vue").Ref<boolean>;
    preDisabled: import("vue").Ref<boolean>;
    nextDisabled: import("vue").Ref<boolean>;
    lastDisabled: import("vue").Ref<boolean>;
  }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
  export default _default;
}
declare module "EFX/agToolbarPanel" {
  const _default: import("vue").DefineComponent<{}, {
    resultQueryButtonList: import("vue").Ref<any[]>;
    resultEditButtonList: import("vue").Ref<any[]>;
    saveChangedData: (saveCallback: Function) => void;
    clickExportButton: () => void;
    clickImportButton: () => void;
    clickAddButton: () => void;
    clickCopyButton: () => void;
    clickDeleteButton: () => void;
    clickSaveButton: () => void;
    change: (editStatus: boolean) => void;
    isEditable: import("vue").Ref<boolean>;
    exportIsAuth: import("vue").Ref<boolean>;
    importIsAuth: import("vue").Ref<boolean>;
    setEditButtons: (buttons: any[]) => void;
    setQueryButtons: (buttons: any[]) => void;
  }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
  export default _default;
}
declare module "EFX/xrEfForm" {
  import { PropType } from 'vue';
  interface IAuthButton {
    name: string;
    desc: string;
    opType: string;
  }
  enum AuthEnum {
    NoAuth = 0,
    HasAuthority = 1,
    TokenExpired = 2
  }
  const _default: import("vue").DefineComponent<{
    inDialogFormName: {
      type: PropType<string | null>;
      default: null;
    };
    haveAuthButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    buttonList: {
      type: PropType<IAuthButton[]>;
      default: () => never[];
    };
    hiddenButton: {
      type: ArrayConstructor;
      default: () => never[];
    };
    customDisableStatus: {
      type: BooleanConstructor;
      default: boolean;
    };
    authButtonDisabled: {
      type: BooleanConstructor;
      default: boolean;
    };
    showConfirmButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    showCancelButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    confirmButtonText: {
      type: StringConstructor;
      default: string;
    };
    cancelButtonText: {
      type: StringConstructor;
      default: string;
    };
  }, {
    loading: import("vue").Ref<boolean>;
    hasAuth: import("vue").Ref<AuthEnum | null>;
    leftButtonBox: import("vue").Ref<HTMLElement | null>;
    clickArrowButton: (arrow: string) => void;
    arrowRightDisabled: import("vue").Ref<boolean>;
    arrowLeftDisabled: import("vue").Ref<boolean>;
    arrowButtonVisible: import("vue").Ref<boolean>;
    isShowRightButton: () => boolean;
    currentClickBtn: IAuthButton;
    optDisabled: import("vue").Ref<boolean>;
    authButtonList: import("vue").Ref<{
      name: string;
      desc: string;
      opType: string;
    }[]>;
    setActiveClass: (item: IAuthButton) => "" | "auth-button__active";
    buttonClick: (btnInfo: IAuthButton) => Promise<void>;
    confirmClick: () => Promise<void>;
    cancelClick: () => Promise<void>;
    showCloseDialogButton: import("vue").Ref<boolean>;
    closeClick: () => void;
    setDisplay: (item: IAuthButton) => "" | "auth-button__hidden";
    handleKeyDown: (event: KeyboardEvent) => false | undefined;
    buttonRefs: import("vue").Ref<(HTMLButtonElement | null)[]>;
    efFormContainer: import("vue").Ref<Element | undefined>;
    currentFormName: import("vue").Ref<string>;
    setRightButtonDisabled: () => boolean;
    setLeftButtonDisabled: () => boolean;
    setDisabledClass: () => "" | "auth-button__disabled";
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("closeEfDialogForm" | "closeDialog" | "initialized" | "ready")[], "closeEfDialogForm" | "closeDialog" | "initialized" | "ready", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    inDialogFormName: {
      type: PropType<string | null>;
      default: null;
    };
    haveAuthButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    buttonList: {
      type: PropType<IAuthButton[]>;
      default: () => never[];
    };
    hiddenButton: {
      type: ArrayConstructor;
      default: () => never[];
    };
    customDisableStatus: {
      type: BooleanConstructor;
      default: boolean;
    };
    authButtonDisabled: {
      type: BooleanConstructor;
      default: boolean;
    };
    showConfirmButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    showCancelButton: {
      type: BooleanConstructor;
      default: boolean;
    };
    confirmButtonText: {
      type: StringConstructor;
      default: string;
    };
    cancelButtonText: {
      type: StringConstructor;
      default: string;
    };
  }>> & {
    onCloseEfDialogForm?: ((...args: any[]) => any) | undefined;
    onCloseDialog?: ((...args: any[]) => any) | undefined;
    onInitialized?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
  }, {
    inDialogFormName: string | null;
    haveAuthButton: boolean;
    buttonList: IAuthButton[];
    hiddenButton: unknown[];
    customDisableStatus: boolean;
    authButtonDisabled: boolean;
    showConfirmButton: boolean;
    showCancelButton: boolean;
    confirmButtonText: string;
    cancelButtonText: string;
  }, {}>;
  export default _default;
}
declare module "EFX/xrEfFormBase" {
  const _default: import("vue").DefineComponent<Readonly<import("vue").ComponentPropsOptions<{
    [x: string]: unknown;
  }>>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, readonly string[] | Readonly<import("vue").ExtractPropTypes<Readonly<import("vue").ComponentObjectPropsOptions<{
    [x: string]: unknown;
  }>>>>, {
    [x: number]: string;
  } | {}, {}>;
  export default _default;
}
declare module "EFX/xrEfPanel" {
  const _default: import("vue").DefineComponent<{
    showHeader: {
      type: BooleanConstructor;
      default: boolean;
    };
    flex: {
      type: NumberConstructor;
      default: number;
    };
    title: {
      type: StringConstructor;
      default: string;
    };
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    isSearchBox: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAuthButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    padding: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    openHeaderShow: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }, {
    openHeader: import("vue").Ref<boolean>;
    flexStyle: import("vue").Ref<string>;
    query: () => void;
    openHeaderChange: () => void;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("queryClick" | "openHeaderChange")[], "queryClick" | "openHeaderChange", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    showHeader: {
      type: BooleanConstructor;
      default: boolean;
    };
    flex: {
      type: NumberConstructor;
      default: number;
    };
    title: {
      type: StringConstructor;
      default: string;
    };
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    isSearchBox: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAuthButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    padding: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    openHeaderShow: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }>> & {
    onQueryClick?: ((...args: any[]) => any) | undefined;
    onOpenHeaderChange?: ((...args: any[]) => any) | undefined;
  }, {
    title: string;
    height: string;
    padding: string;
    showHeader: boolean;
    flex: number;
    isSearchBox: boolean;
    showAuthButton: boolean;
    openHeaderShow: boolean;
  }, {}>;
  export default _default;
}
declare module "EFX/xrEfSearchBox" {
  const _default: import("vue").DefineComponent<{
    title: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    showAuthButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    padding: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    openHeaderShow: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }, {
    searchClick: (e: any) => void;
    openChange: (e: any) => void;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("openHeaderChange" | "searchClick")[], "openHeaderChange" | "searchClick", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    title: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    showAuthButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    padding: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    openHeaderShow: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }>> & {
    onOpenHeaderChange?: ((...args: any[]) => any) | undefined;
    onSearchClick?: ((...args: any[]) => any) | undefined;
  }, {
    title: string;
    height: string;
    padding: string;
    showAuthButton: boolean;
    openHeaderShow: boolean;
  }, {}>;
  export default _default;
}
declare module "EFX/xrEfDialog" {
  const _default: import("vue").DefineComponent<{
    debounce: {
      type: BooleanConstructor;
      default: boolean;
    };
    debounceWait: {
      type: NumberConstructor;
      default: number;
    };
    visible: {
      type: BooleanConstructor;
      required: true;
    };
    title: {
      type: StringConstructor;
      default: string;
    };
    width: {
      type: (NumberConstructor | StringConstructor)[];
      default: string;
    };
    height: {
      type: (NumberConstructor | StringConstructor)[];
      default: string;
    };
    modal: {
      type: BooleanConstructor;
      default: boolean;
    };
    defaultFooter: {
      type: BooleanConstructor;
      default: boolean;
    };
    destroyOnClose: {
      type: BooleanConstructor;
      default: boolean;
    };
    showConfirm: {
      type: BooleanConstructor;
      default: boolean;
    };
    showCancel: {
      type: BooleanConstructor;
      default: boolean;
    };
  }, {
    dialogHeight: import("vue").Ref<string | number>;
    dialogWidth: import("vue").Ref<string | number>;
    isRender: import("vue").Ref<boolean>;
    dialogFrameRef: any;
    xrEfDialogRef: any;
    onClickClose: () => void;
    modalZIndex: import("vue").Ref<number>;
    confirmClick: () => void;
    cancelClick: () => void;
    dialogResize: () => void;
    onOpen: () => void;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("cancel" | "open" | "clickCloseIcon" | "update:visible" | "confirm" | "dialogResize")[], "cancel" | "open" | "clickCloseIcon" | "update:visible" | "confirm" | "dialogResize", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    debounce: {
      type: BooleanConstructor;
      default: boolean;
    };
    debounceWait: {
      type: NumberConstructor;
      default: number;
    };
    visible: {
      type: BooleanConstructor;
      required: true;
    };
    title: {
      type: StringConstructor;
      default: string;
    };
    width: {
      type: (NumberConstructor | StringConstructor)[];
      default: string;
    };
    height: {
      type: (NumberConstructor | StringConstructor)[];
      default: string;
    };
    modal: {
      type: BooleanConstructor;
      default: boolean;
    };
    defaultFooter: {
      type: BooleanConstructor;
      default: boolean;
    };
    destroyOnClose: {
      type: BooleanConstructor;
      default: boolean;
    };
    showConfirm: {
      type: BooleanConstructor;
      default: boolean;
    };
    showCancel: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & {
    onOpen?: ((...args: any[]) => any) | undefined;
    onCancel?: ((...args: any[]) => any) | undefined;
    onClickCloseIcon?: ((...args: any[]) => any) | undefined;
    "onUpdate:visible"?: ((...args: any[]) => any) | undefined;
    onConfirm?: ((...args: any[]) => any) | undefined;
    onDialogResize?: ((...args: any[]) => any) | undefined;
  }, {
    title: string;
    width: string | number;
    height: string | number;
    modal: boolean;
    debounce: boolean;
    debounceWait: number;
    defaultFooter: boolean;
    destroyOnClose: boolean;
    showConfirm: boolean;
    showCancel: boolean;
  }, {}>;
  export default _default;
}
declare module "EFX/EFDialogForm" {
  import { EfDialogFormOptions } from 'EFX/efx-model';
  /**
   * @description: 获取efDialogForm组件挂载dom
   * @param {string} formName
   * @param {{ [key: string]: any }} message
   * @param {EfDialogFormOptions} options
   * @return {*} efDialogForm组件
   */
  const getEfDialogFormDom: {
    (formName: string, message?: {
      [key: string]: any;
    } | undefined, options?: EfDialogFormOptions): import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}>;
    open(formName: string, message?: {
      [key: string]: any;
    } | undefined, options?: EfDialogFormOptions): any;
  };
  export default getEfDialogFormDom;
  export class EFDialogFormMessage {
    static receive: (id: string, callback: Function) => void;
    static post: (id: string, message: {
      [key: string]: any;
    }) => void;
  }
}

declare module "EFX/efx-model" {
  export type TTitleType = 'both' | 'field' | 'desc';
  export interface IExportHeader {
    titleType: TTitleType;
  }
  export interface IExportConfig {
    exportData?: Record<string, any>;
    fileName?: string;
    header?: IExportHeader;
  }
  export interface EfDialogFormOptions {
    modal?: boolean;
    width?: string | number;
    height?: string | number;
    title?: string;
  }
}
declare module "EFX/EFGridUtils" {
  import { IExportConfig } from 'EFX/efx-model';
  export default class EFGridUtils {
    static exportGridAsExcel(gridRef: any, exportConfig: IExportConfig): void;
    static getImportExcelData(gridInstance: any): Promise<any[]>;
    static importExcelToGrid(gridRef: any): Promise<unknown>;
    static renderImportDataToGrid(gridRef: any, excelData: any[]): void;
  }
}

declare module "EFX/EFUtility" {
  import { EI } from "EIX/ei";
  export default class Utility {
    /**
     * 根据传入的代码编号获取值集信息
     * @param partName 分区名，传入''调用默认分区服务
     * @param codeClassNames 代码编号数组
     * @param boolean 是否判断细部资源权限
     */
    static getCodeClassValue(
      partName: string,
      codeClassNames: string[],
      auth?: boolean
    ): Promise<EI.EIInfo>;
    /**
     * 在指定的分区上执行动态查询
     * @param partName 分区名称
     * @param sqls SQL语句列表
     */
    static execQueryPart(partName: string, sqls: string[]): Promise<EI.EIInfo>;
    /**
     * 根据传入的时间戳、班次类获取对应班次、班组信息
     * @param time 时间戳，日期类型
     * @param shiftClass 班次类
     * @param partName 分区名，不传，则调用默认分区服务
     */
    static getShiftNoGroup(
      time: Date,
      shiftClass: string,
      partName?: string
    ): Promise<
      | {
        shift_no: import("EIX/ei").ValueType;
        shift_group: import("EIX/ei").ValueType;
      }
      | undefined
    >;
    /**
     * 根据传入的时间戳、班次类获取对应班次、班组、班次日期信息
     * @param time 时间戳，日期类型
     * @param shiftClass 班次类
     * @param partName 分区名，不传，则调用默认分区服务
     */
    static getShiftNoGroupDate(
      time: Date,
      shiftClass: string,
      partName?: string
    ): Promise<
      | {
        shift_no: import("EIX/ei").ValueType;
        shift_group: import("EIX/ei").ValueType;
        shift_day: import("EIX/ei").ValueType;
      }
      | undefined
    >;
    /**
     * 计算打开每个画面所花费的时间
     */
    static calcLoadDuration(): void;
  }
}
declare module "EFX/EFCallForm" {
  /**
 * 打开画面，跨子应用画面只能在父应用上才能生效
 * @param formName 画面名
 * @param formParams 可选，url传参参数
 */
  const EFCallForm: (formName: string, formParams?: Record<string, any>) => void;
  export default EFCallForm;
}

declare module "EFX/agPlugins" {
  import "@ag-grid-community/styles/ag-grid.min.css";
  import "@ag-grid-community/styles/ag-theme-balham.min.css";
  import { ModuleRegistry } from "@ag-grid-community/core";
  import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
  import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
  import { SideBarModule } from "@ag-grid-enterprise/side-bar";
  import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
  import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
  import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
  import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
  import { AdvancedFilterModule } from "@ag-grid-enterprise/advanced-filter";
  import { MultiFilterModule } from "@ag-grid-enterprise/multi-filter";
  import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
  import { GridChartsModule } from "@ag-grid-enterprise/charts";
  import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
  import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
  import { SparklinesModule } from "@ag-grid-enterprise/sparklines";
  import { MenuModule } from "@ag-grid-enterprise/menu";
  import { CsvExportModule, CsvCreator } from "@ag-grid-community/csv-export";
  import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model";
  import { ClipboardModule } from "@ag-grid-enterprise/clipboard";
  import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
  import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
  import { ViewportRowModelModule } from "@ag-grid-enterprise/viewport-row-model";
  export {
    CsvExportModule,
    CsvCreator,
    InfiniteRowModelModule,
    ClipboardModule,
    RichSelectModule,
    ServerSideRowModelModule,
    ViewportRowModelModule,
    ModuleRegistry,
    ExcelExportModule,
    StatusBarModule,
    SideBarModule,
    ClientSideRowModelModule,
    RowGroupingModule,
    SetFilterModule,
    FiltersToolPanelModule,
    AdvancedFilterModule,
    MultiFilterModule,
    ColumnsToolPanelModule,
    MenuModule,
    GridChartsModule,
    MasterDetailModule,
    RangeSelectionModule,
    SparklinesModule,
  };
}
declare module "EFX/AgGridVue" {
  import { AgGridVue } from "@ag-grid-community/vue3";
  export default AgGridVue;
}
declare module "EFX/ag-i18n-cn" {
  const AG_GRID_LOCALE_ZH: {
    selectAll: string;
    selectAllSearchResults: string;
    addCurrentSelectionToFilter: string;
    searchOoo: string;
    blanks: string;
    noMatches: string;
    filterOoo: string;
    equals: string;
    notEqual: string;
    blank: string;
    notBlank: string;
    empty: string;
    lessThan: string;
    greaterThan: string;
    lessThanOrEqual: string;
    greaterThanOrEqual: string;
    inRange: string;
    inRangeStart: string;
    inRangeEnd: string;
    contains: string;
    notContains: string;
    startsWith: string;
    endsWith: string;
    dateFormatOoo: string;
    andCondition: string;
    orCondition: string;
    applyFilter: string;
    resetFilter: string;
    clearFilter: string;
    cancelFilter: string;
    textFilter: string;
    numberFilter: string;
    dateFilter: string;
    setFilter: string;
    groupFilterSelect: string;
    advancedFilterContains: string;
    advancedFilterNotContains: string;
    advancedFilterTextEquals: string;
    advancedFilterTextNotEqual: string;
    advancedFilterStartsWith: string;
    advancedFilterEndsWith: string;
    advancedFilterBlank: string;
    advancedFilterNotBlank: string;
    advancedFilterEquals: string;
    advancedFilterNotEqual: string;
    advancedFilterGreaterThan: string;
    advancedFilterGreaterThanOrEqual: string;
    advancedFilterLessThan: string;
    advancedFilterLessThanOrEqual: string;
    advancedFilterTrue: string;
    advancedFilterFalse: string;
    advancedFilterAnd: string;
    advancedFilterOr: string;
    advancedFilterApply: string;
    advancedFilterBuilder: string;
    advancedFilterValidationMissingColumn: string;
    advancedFilterValidationMissingOption: string;
    advancedFilterValidationMissingValue: string;
    advancedFilterValidationInvalidColumn: string;
    advancedFilterValidationInvalidOption: string;
    advancedFilterValidationMissingQuote: string;
    advancedFilterValidationNotANumber: string;
    advancedFilterValidationInvalidDate: string;
    advancedFilterValidationMissingCondition: string;
    advancedFilterValidationJoinOperatorMismatch: string;
    advancedFilterValidationInvalidJoinOperator: string;
    advancedFilterValidationMissingEndBracket: string;
    advancedFilterValidationExtraEndBracket: string;
    advancedFilterValidationMessage: string;
    advancedFilterValidationMessageAtEnd: string;
    advancedFilterBuilderTitle: string;
    advancedFilterBuilderApply: string;
    advancedFilterBuilderCancel: string;
    advancedFilterBuilderAddButtonTooltip: string;
    advancedFilterBuilderRemoveButtonTooltip: string;
    advancedFilterBuilderMoveUpButtonTooltip: string;
    advancedFilterBuilderMoveDownButtonTooltip: string;
    advancedFilterBuilderAddJoin: string;
    advancedFilterBuilderAddCondition: string;
    advancedFilterBuilderSelectColumn: string;
    advancedFilterBuilderSelectOption: string;
    advancedFilterBuilderEnterValue: string;
    advancedFilterBuilderValidationAlreadyApplied: string;
    advancedFilterBuilderValidationIncomplete: string;
    advancedFilterBuilderValidationSelectColumn: string;
    advancedFilterBuilderValidationSelectOption: string;
    advancedFilterBuilderValidationEnterValue: string;
    columns: string;
    filters: string;
    pivotMode: string;
    groups: string;
    rowGroupColumnsEmptyMessage: string;
    values: string;
    valueColumnsEmptyMessage: string;
    pivots: string;
    pivotColumnsEmptyMessage: string;
    group: string;
    rowDragRow: string;
    rowDragRows: string;
    loadingOoo: string;
    loadingError: string;
    noRowsToShow: string;
    enabled: string;
    pinColumn: string;
    pinLeft: string;
    pinRight: string;
    noPin: string;
    valueAggregation: string;
    noAggregation: string;
    autosizeThiscolumn: string;
    autosizeAllColumns: string;
    groupBy: string;
    ungroupBy: string;
    ungroupAll: string;
    addToValues: string;
    removeFromValues: string;
    addToLabels: string;
    removeFromLabels: string;
    resetColumns: string;
    expandAll: string;
    collapseAll: string;
    copy: string;
    ctrlC: string;
    ctrlX: string;
    copyWithHeaders: string;
    copyWithGroupHeaders: string;
    cut: string;
    paste: string;
    ctrlV: string;
    export: string;
    csvExport: string;
    excelExport: string;
    sum: string;
    first: string;
    last: string;
    min: string;
    max: string;
    none: string;
    count: string;
    avg: string;
    filteredRows: string;
    selectedRows: string;
    totalRows: string;
    totalAndFilteredRows: string;
    more: string;
    to: string;
    of: string;
    page: string;
    pageLastRowUnknown: string;
    nextPage: string;
    lastPage: string;
    firstPage: string;
    previousPage: string;
    pivotColumnGroupTotals: string;
    pivotChartAndPivotMode: string;
    pivotChart: string;
    chartRange: string;
    columnChart: string;
    groupedColumn: string;
    stackedColumn: string;
    normalizedColumn: string;
    barChart: string;
    groupedBar: string;
    stackedBar: string;
    normalizedBar: string;
    pieChart: string;
    pie: string;
    doughnut: string;
    line: string;
    xyChart: string;
    scatter: string;
    bubble: string;
    areaChart: string;
    area: string;
    stackedArea: string;
    normalizedArea: string;
    histogramChart: string;
    histogramFrequency: string;
    combinationChart: string;
    columnLineCombo: string;
    AreaColumnCombo: string;
    pivotChartTitle: string;
    rangeChartTitle: string;
    settings: string;
    data: string;
    format: string;
    categories: string;
    defaultCategory: string;
    series: string;
    xyValues: string;
    paired: string;
    axis: string;
    navigator: string;
    color: string;
    thickness: string;
    xType: string;
    automatic: string;
    category: string;
    number: string;
    time: string;
    autoRotate: string;
    xRotation: string;
    yRotation: string;
    ticks: string;
    width: string;
    height: string;
    length: string;
    padding: string;
    spacing: string;
    chart: string;
    title: string;
    titlePlaceholder: string;
    background: string;
    font: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
    labels: string;
    size: string;
    minSize: string;
    maxSize: string;
    legend: string;
    position: string;
    markerSize: string;
    markerStroke: string;
    markerPadding: string;
    itemSpacing: string;
    itemPaddingX: string;
    itemPaddingY: string;
    layoutHorizontalSpacing: string;
    layoutVerticalSpacing: string;
    strokeWidth: string;
    lineDash: string;
    offset: string;
    offsets: string;
    tooltips: string;
    callout: string;
    markers: string;
    shadow: string;
    blur: string;
    xOffset: string;
    yOffset: string;
    lineWidth: string;
    normal: string;
    bold: string;
    italic: string;
    boldItalic: string;
    predefined: string;
    fillOpacity: string;
    strokeOpacity: string;
    histogramBinCount: string;
    columnGroup: string;
    barGroup: string;
    pieGroup: string;
    lineGroup: string;
    scatterGroup: string;
    areaGroup: string;
    histogramGroup: string;
    combinationGroup: string;
    groupedColumnTooltip: string;
    stackedColumnTooltip: string;
    normalizedColumnTooltip: string;
    groupedBarTooltip: string;
    stackedBarTooltip: string;
    normalizedBarTooltip: string;
    pieTooltip: string;
    doughnutTooltip: string;
    lineTooltip: string;
    groupedAreaTooltip: string;
    stackedAreaTooltip: string;
    normalizedAreaTooltip: string;
    scatterTooltip: string;
    bubbleTooltip: string;
    histogramTooltip: string;
    columnLineComboTooltip: string;
    areaColumnComboTooltip: string;
    customComboTooltip: string;
    noDataToChart: string;
    pivotChartRequiresPivotMode: string;
    chartSettingsToolbarTooltip: string;
    chartLinkToolbarTooltip: string;
    chartUnlinkToolbarTooltip: string;
    chartDownloadToolbarTooltip: string;
    seriesChartType: string;
    seriesType: string;
    secondaryAxis: string;
    ariaAdvancedFilterBuilderItem: string;
    ariaAdvancedFilterBuilderItemValidation: string;
    ariaAdvancedFilterBuilderList: string;
    ariaAdvancedFilterBuilderFilterItem: string;
    ariaAdvancedFilterBuilderGroupItem: string;
    ariaAdvancedFilterBuilderColumn: string;
    ariaAdvancedFilterBuilderOption: string;
    ariaAdvancedFilterBuilderValueP: string;
    ariaAdvancedFilterBuilderJoinOperator: string;
    ariaAdvancedFilterInput: string;
    ariaChecked: string;
    ariaColumn: string;
    ariaColumnGroup: string;
    ariaColumnList: string;
    ariaColumnSelectAll: string;
    ariaDateFilterInput: string;
    ariaDefaultListName: string;
    ariaFilterColumnsInput: string;
    ariaFilterFromValue: string;
    ariaFilterInput: string;
    ariaFilterList: string;
    ariaFilterToValue: string;
    ariaFilterValue: string;
    ariaFilterMenuOpen: string;
    ariaFilteringOperator: string;
    ariaHidden: string;
    ariaIndeterminate: string;
    ariaInputEditor: string;
    ariaMenuColumn: string;
    ariaRowDeselect: string;
    ariaRowSelectAll: string;
    ariaRowToggleSelection: string;
    ariaRowSelect: string;
    ariaSearch: string;
    ariaSortableColumn: string;
    ariaToggleVisibility: string;
    ariaToggleCellValue: string;
    ariaUnchecked: string;
    ariaVisible: string;
    ariaSearchFilterValues: string;
    ariaRowGroupDropZonePanelLabel: string;
    ariaValuesDropZonePanelLabel: string;
    ariaPivotDropZonePanelLabel: string;
    ariaDropZoneColumnComponentDescription: string;
    ariaDropZoneColumnValueItemDescription: string;
    ariaDropZoneColumnGroupItemDescription: string;
    ariaDropZoneColumnComponentAggFuncSeparator: string;
    ariaDropZoneColumnComponentSortAscending: string;
    ariaDropZoneColumnComponentSortDescending: string;
    ariaLabelColumnMenu: string;
    ariaLabelCellEditor: string;
    ariaLabelDialog: string;
    ariaLabelSelectField: string;
    ariaLabelRichSelectField: string;
    ariaLabelTooltip: string;
    ariaLabelContextMenu: string;
    ariaLabelSubMenu: string;
    ariaLabelAggregationFunction: string;
    ariaLabelAdvancedFilterAutocomplete: string;
    ariaLabelAdvancedFilterBuilderAddField: string;
    ariaLabelAdvancedFilterBuilderColumnSelectField: string;
    ariaLabelAdvancedFilterBuilderOptionSelectField: string;
    ariaLabelAdvancedFilterBuilderJoinSelectField: string;
    thousandSeparator: string;
    decimalSeparator: string;
    true: string;
    false: string;
    invalidDate: string;
    invalidNumber: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
  export default AG_GRID_LOCALE_ZH;
}
declare module "EFX/theme" {
  export const getTheme: () => "default" | "ghostShark";
  /**
   * 换取antd主题配置
   * @returns
   */
  export const getAntdTheme: () =>
    | {
      token: {
        fontSize: number;
        sizeStep: number;
        borderRadius: number;
        wireframe: boolean;
        colorPrimary: string;
      };
      components: {
        Tabs: {
          colorFillAlter: string;
          colorBgContainer: string;
          colorPrimary: string;
          colorText: string;
          colorSplit: string;
          colorBorder: string;
          colorPrimaryBorder: string;
          lineHeight: number;
        };
      };
    }
    | {
      token: {
        fontSize: number;
        sizeStep: number;
        borderRadius: number;
        wireframe: boolean;
        colorPrimary: string;
        colorPrimaryBorder: string;
        colorPrimaryBorderHover: string;
        colorPrimaryText: string;
      };
      components: {
        Button: {
          colorBgContainer: string;
          colorBorder: string;
          colorText: string;
        };
        Form: {
          colorPrimary: string;
          colorTextHeading: string;
          colorTextDescription: string;
          colorText: string;
          colorBorder: string;
          controlOutline: string;
          colorError: string;
        };
        Input: {
          colorBgContainer: string;
          colorBorder: string;
          colorIconHover: string;
          colorPrimaryActive: string;
          colorBgContainerDisabled: string;
          colorText: string;
        };
        Checkbox: {
          colorBgContainer: string;
          colorBorder: string;
        };
        InputNumber: {
          colorBgContainer: string;
          colorBorder: string;
          colorIconHover: string;
          colorPrimaryActive: string;
          colorBgContainerDisabled: string;
          colorText: string;
        };
        Radio: {
          colorBgContainer: string;
          colorBgContainerDisabled: string;
        };
        Switch: {
          colorPrimary: string;
          colorBgContainer: string;
        };
        TreeSelect: {
          colorBgContainer: string;
        };
        Tabs: {
          colorPrimaryActive: string;
          colorBgContainer: string;
          colorPrimary: string;
          colorFillAlter: string;
          colorSplit: string;
          colorText: string;
        };
        Select: {
          colorBgContainer: string;
          colorBgContainerDisabled: string;
          colorBgElevated: string;
          controlItemBgActive: string;
          colorBorder: string;
          colorText: string;
        };
        DatePicker: {
          colorBgContainer: string;
          colorBgContainerDisabled: string;
          colorBorder: string;
          colorText: string;
          colorBgElevated: string;
        };
        Calendar: {
          colorBgContainer: string;
        };
      };
    };
  /**
   * 换肤
   * @param theme 主题
   * @param reload 是否强制换肤
   */
  export const changeTheme: (theme?: string, reload?: boolean) => void;
}
declare module "EFX/xrEfSelect" {
  const _default: import("vue").DefineComponent<
    {
      modelValue: {
        type: (ArrayConstructor | StringConstructor)[];
      };
      options: {
        type: ObjectConstructor;
        default: () => void;
      };
      columns: ArrayConstructor;
      data: ArrayConstructor;
    },
    {},
    unknown,
    {},
    {},
    import("vue").ComponentOptionsMixin,
    import("vue").ComponentOptionsMixin,
    {
      change: (...args: any[]) => void;
      "update:modelValue": (...args: any[]) => void;
    },
    string,
    import("vue").VNodeProps &
    import("vue").AllowedComponentProps &
    import("vue").ComponentCustomProps,
    Readonly<
      import("vue").ExtractPropTypes<{
        modelValue: {
          type: (ArrayConstructor | StringConstructor)[];
        };
        options: {
          type: ObjectConstructor;
          default: () => void;
        };
        columns: ArrayConstructor;
        data: ArrayConstructor;
      }>
    > & {
      onChange?: ((...args: any[]) => any) | undefined;
      "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    },
    {
      options: Record<string, any>;
    },
    {}
  >;
  export default _default;
}
declare module "EFX/agMultiDropDownEditor" {
  const _default: import("vue").DefineComponent<
    Readonly<{
      params?: any;
    }>,
    {
      rowWasClicked: (e: any) => void;
      rowMultiSelect: import("vue").Ref<boolean>;
      inputValue: import("vue").Ref<any[]>;
      FatherGridApi: any;
      getValue: () => string;
      cellWasClicked: (e: any) => void;
      defaultColDef: any;
      columnDefs: any;
      rowData: any;
      onGridReady: (params: any) => void;
    },
    unknown,
    {},
    {},
    import("vue").ComponentOptionsMixin,
    import("vue").ComponentOptionsMixin,
    {},
    string,
    import("vue").VNodeProps &
    import("vue").AllowedComponentProps &
    import("vue").ComponentCustomProps,
    Readonly<
      import("vue").ExtractPropTypes<
        Readonly<{
          params?: any;
        }>
      >
    >,
    {
      readonly params?: any;
    },
    {}
  >;
  export default _default;
}

declare module "EFX/agDateEditor" {
  const _default: import("vue").DefineComponent<
    Readonly<{
      params?: any;
    }>,
    {
      localDateTime: any;
      getValue: () => any;
      onChange: () => void;
      onOk: (e: any) => void;
    },
    unknown,
    {},
    {},
    import("vue").ComponentOptionsMixin,
    import("vue").ComponentOptionsMixin,
    {},
    string,
    import("vue").VNodeProps &
    import("vue").AllowedComponentProps &
    import("vue").ComponentCustomProps,
    Readonly<
      import("vue").ExtractPropTypes<
        Readonly<{
          params?: any;
        }>
      >
    >,
    {
      readonly params?: any;
    },
    {}
  >;
  export default _default;
}

declare module "EFX/useI18n" {
  export default function useI18n(): {
    $t: {
      <Key extends string, DefinedLocaleMessage extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage> extends false ? import("vue-i18n").PickupPaths<{ [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]; }> : never, ResourceKeys extends Keys = import("vue-i18n").IsNever<Keys> extends false ? Keys : never>(key: string | Key | ResourceKeys): string;
      <Key_1 extends string, DefinedLocaleMessage_1 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_1 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_1> extends false ? import("vue-i18n").PickupPaths<{ [K_1 in keyof DefinedLocaleMessage_1]: DefinedLocaleMessage_1[K_1]; }> : never, ResourceKeys_1 extends Keys_1 = import("vue-i18n").IsNever<Keys_1> extends false ? Keys_1 : never>(key: string | Key_1 | ResourceKeys_1): string;
      <Key_2 extends string, DefinedLocaleMessage_2 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_2 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_2> extends false ? import("vue-i18n").PickupPaths<{ [K_2 in keyof DefinedLocaleMessage_2]: DefinedLocaleMessage_2[K_2]; }> : never, ResourceKeys_2 extends Keys_2 = import("vue-i18n").IsNever<Keys_2> extends false ? Keys_2 : never>(key: string | Key_2 | ResourceKeys_2, locale: string, list: unknown[]): string;
      <Key_3 extends string, DefinedLocaleMessage_3 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_3 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_3> extends false ? import("vue-i18n").PickupPaths<{ [K_3 in keyof DefinedLocaleMessage_3]: DefinedLocaleMessage_3[K_3]; }> : never, ResourceKeys_3 extends Keys_3 = import("vue-i18n").IsNever<Keys_3> extends false ? Keys_3 : never>(key: string | Key_3 | ResourceKeys_3, locale: string, named: object): string;
      <Key_4 extends string, DefinedLocaleMessage_4 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_4 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_4> extends false ? import("vue-i18n").PickupPaths<{ [K_4 in keyof DefinedLocaleMessage_4]: DefinedLocaleMessage_4[K_4]; }> : never, ResourceKeys_4 extends Keys_4 = import("vue-i18n").IsNever<Keys_4> extends false ? Keys_4 : never>(key: string | Key_4 | ResourceKeys_4, list: unknown[]): string;
      <Key_5 extends string, DefinedLocaleMessage_5 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_5 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_5> extends false ? import("vue-i18n").PickupPaths<{ [K_5 in keyof DefinedLocaleMessage_5]: DefinedLocaleMessage_5[K_5]; }> : never, ResourceKeys_5 extends Keys_5 = import("vue-i18n").IsNever<Keys_5> extends false ? Keys_5 : never>(key: string | Key_5 | ResourceKeys_5, named: Record<string, unknown>): string;
      <Key_6 extends string, DefinedLocaleMessage_6 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_6 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_6> extends false ? import("vue-i18n").PickupPaths<{ [K_6 in keyof DefinedLocaleMessage_6]: DefinedLocaleMessage_6[K_6]; }> : never, ResourceKeys_6 extends Keys_6 = import("vue-i18n").IsNever<Keys_6> extends false ? Keys_6 : never>(key: string | Key_6 | ResourceKeys_6): string;
      <Key_7 extends string, DefinedLocaleMessage_7 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_7 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_7> extends false ? import("vue-i18n").PickupPaths<{ [K_7 in keyof DefinedLocaleMessage_7]: DefinedLocaleMessage_7[K_7]; }> : never, ResourceKeys_7 extends Keys_7 = import("vue-i18n").IsNever<Keys_7> extends false ? Keys_7 : never>(key: string | Key_7 | ResourceKeys_7, plural: number): string;
      <Key_8 extends string, DefinedLocaleMessage_8 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_8 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_8> extends false ? import("vue-i18n").PickupPaths<{ [K_8 in keyof DefinedLocaleMessage_8]: DefinedLocaleMessage_8[K_8]; }> : never, ResourceKeys_8 extends Keys_8 = import("vue-i18n").IsNever<Keys_8> extends false ? Keys_8 : never>(key: string | Key_8 | ResourceKeys_8, plural: number, options: import("vue-i18n").TranslateOptions<string>): string;
      <Key_9 extends string, DefinedLocaleMessage_9 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_9 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_9> extends false ? import("vue-i18n").PickupPaths<{ [K_9 in keyof DefinedLocaleMessage_9]: DefinedLocaleMessage_9[K_9]; }> : never, ResourceKeys_9 extends Keys_9 = import("vue-i18n").IsNever<Keys_9> extends false ? Keys_9 : never>(key: string | Key_9 | ResourceKeys_9, defaultMsg: string): string;
      <Key_10 extends string, DefinedLocaleMessage_10 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_10 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_10> extends false ? import("vue-i18n").PickupPaths<{ [K_10 in keyof DefinedLocaleMessage_10]: DefinedLocaleMessage_10[K_10]; }> : never, ResourceKeys_10 extends Keys_10 = import("vue-i18n").IsNever<Keys_10> extends false ? Keys_10 : never>(key: string | Key_10 | ResourceKeys_10, defaultMsg: string, options: import("vue-i18n").TranslateOptions<string>): string;
      <Key_11 extends string, DefinedLocaleMessage_11 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_11 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_11> extends false ? import("vue-i18n").PickupPaths<{ [K_11 in keyof DefinedLocaleMessage_11]: DefinedLocaleMessage_11[K_11]; }> : never, ResourceKeys_11 extends Keys_11 = import("vue-i18n").IsNever<Keys_11> extends false ? Keys_11 : never>(key: string | Key_11 | ResourceKeys_11, list: unknown[]): string;
      <Key_12 extends string, DefinedLocaleMessage_12 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_12 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_12> extends false ? import("vue-i18n").PickupPaths<{ [K_12 in keyof DefinedLocaleMessage_12]: DefinedLocaleMessage_12[K_12]; }> : never, ResourceKeys_12 extends Keys_12 = import("vue-i18n").IsNever<Keys_12> extends false ? Keys_12 : never>(key: string | Key_12 | ResourceKeys_12, list: unknown[], plural: number): string;
      <Key_13 extends string, DefinedLocaleMessage_13 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_13 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_13> extends false ? import("vue-i18n").PickupPaths<{ [K_13 in keyof DefinedLocaleMessage_13]: DefinedLocaleMessage_13[K_13]; }> : never, ResourceKeys_13 extends Keys_13 = import("vue-i18n").IsNever<Keys_13> extends false ? Keys_13 : never>(key: string | Key_13 | ResourceKeys_13, list: unknown[], defaultMsg: string): string;
      <Key_14 extends string, DefinedLocaleMessage_14 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_14 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_14> extends false ? import("vue-i18n").PickupPaths<{ [K_14 in keyof DefinedLocaleMessage_14]: DefinedLocaleMessage_14[K_14]; }> : never, ResourceKeys_14 extends Keys_14 = import("vue-i18n").IsNever<Keys_14> extends false ? Keys_14 : never>(key: string | Key_14 | ResourceKeys_14, list: unknown[], options: import("vue-i18n").TranslateOptions<string>): string;
      <Key_15 extends string, DefinedLocaleMessage_15 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_15 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_15> extends false ? import("vue-i18n").PickupPaths<{ [K_15 in keyof DefinedLocaleMessage_15]: DefinedLocaleMessage_15[K_15]; }> : never, ResourceKeys_15 extends Keys_15 = import("vue-i18n").IsNever<Keys_15> extends false ? Keys_15 : never>(key: string | Key_15 | ResourceKeys_15, named: Record<string, unknown>): string;
      <Key_16 extends string, DefinedLocaleMessage_16 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_16 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_16> extends false ? import("vue-i18n").PickupPaths<{ [K_16 in keyof DefinedLocaleMessage_16]: DefinedLocaleMessage_16[K_16]; }> : never, ResourceKeys_16 extends Keys_16 = import("vue-i18n").IsNever<Keys_16> extends false ? Keys_16 : never>(key: string | Key_16 | ResourceKeys_16, named: Record<string, unknown>, plural: number): string;
      <Key_17 extends string, DefinedLocaleMessage_17 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_17 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_17> extends false ? import("vue-i18n").PickupPaths<{ [K_17 in keyof DefinedLocaleMessage_17]: DefinedLocaleMessage_17[K_17]; }> : never, ResourceKeys_17 extends Keys_17 = import("vue-i18n").IsNever<Keys_17> extends false ? Keys_17 : never>(key: string | Key_17 | ResourceKeys_17, named: Record<string, unknown>, defaultMsg: string): string;
      <Key_18 extends string, DefinedLocaleMessage_18 extends import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }> = import("@intlify/core-base").RemoveIndexSignature<{
        [x: string]: import("vue-i18n").LocaleMessageValue<import("vue-i18n").VueMessageType>;
      }>, Keys_18 = import("vue-i18n").IsEmptyObject<DefinedLocaleMessage_18> extends false ? import("vue-i18n").PickupPaths<{ [K_18 in keyof DefinedLocaleMessage_18]: DefinedLocaleMessage_18[K_18]; }> : never, ResourceKeys_18 extends Keys_18 = import("vue-i18n").IsNever<Keys_18> extends false ? Keys_18 : never>(key: string | Key_18 | ResourceKeys_18, named: Record<string, unknown>, options: import("vue-i18n").TranslateOptions<string>): string;
    };
  };
}

declare module "EFX/locale" {
  import { Locale } from 'ant-design-vue/es/locale';
  import 'dayjs/locale/zh-cn';
  import 'dayjs/locale/zh-hk';
  import 'dayjs/locale/en';
  /**
   * @description: 获取当前需要切换的语言类型
   * @param {*} string
   * @return {*}
   */
  export const getLocale: () => string;
  const getVueI18n: (messages: any) => import("vue-i18n").I18n<any, {}, {}, string, false>;
  /**
   * @description: 切换语言
   * @param {*} locale
   * @param {*} realReload
   * @return {*}
   */
  export const setI18nLanguage: (locale: "zh_Hans" | 'en', realReload?: boolean) => void;
  export const getAgLocaleText: () => {};
  export const getAntdLocale: () => Locale;
  export const getDayjsLocale: () => string;
  export default getVueI18n;
}
declare module "EFX/eBFR" {
  const eBFR: {
    ExportReportFile: (reportInfodata: { [key: string]: any }) => Promise<any>;
    OpenReportFile: (reportInfodata: { [key: string]: any }) => Promise<void>;
    ReportPrintInfo: (reportInfodata: { [key: string]: any }) => Promise<void>;
    GetReportViewInfoAnsy: (
      RENAME: string,
      PARAM: string,
      FILENAME: string,
      CERTIPRINTNO: string,
      UploadFileAddress: string
    ) => Promise<void>;
    GetReportViewInfoAnsyInfo: (reportInfodata: {
      [key: string]: any;
    }) => Promise<void>;
    SilentPrintingAnsy: (
      RENAME: string,
      PARAM: string,
      PRINTNAME: string,
      CONMPUTER_IP: string,
      PRINT_COUNT: Number
    ) => Promise<void>;
    SilentPrinting: (
      RENAME: string,
      PARAM: string,
      PRINTNAME: string,
      PRINT_COUNT: Number
    ) => Promise<void>;
    CallReportPDFFrom: (RENAME: string, PARAM: string) => Promise<void>;
    CallReportPDFFromMap: (
      RENAME: string,
      PARAM: Map<any, any>
    ) => Promise<void>;
    CallReportXLSXFrom: (RENAME: string, PARAM: string) => Promise<void>;
    CallReportXLSXFromReadOnly: (
      RENAME: string,
      PARAM: string,
      READONLY: string
    ) => Promise<void>;
    CallReportPDF: (RENAME: string, PARAM: string) => Promise<void>;
    CallReportXLSX: (RENAME: string, PARAM: string) => Promise<void>;
  };
  export default eBFR;
}
