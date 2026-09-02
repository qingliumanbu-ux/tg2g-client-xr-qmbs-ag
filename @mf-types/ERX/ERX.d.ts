///<reference types="../EIX" />
declare module "ERX/er-type" {
  /**
   * XrErPopFree组件返回参数
   */
  export interface PopFreeReturnInfo {
    sender: any;
    dialogResult: 'ok' | 'cancel' | 'none';
    formHelper: any;
    dataModel: any;
    modelId?: string;
    isModified: boolean;
    context?: any;
  }
  /**
   * ErPopQuery组件返回参数
   */
  export interface PopQueryReturnInfo {
    sender: any;
    dialogResult: 'ok' | 'cancel' | 'clear' | 'none';
    formHelper: any;
    modelId: string;
    checkedItem?: any;
    checkedItemArray?: any[];
    checkedCodes?: string;
    checkedDescs?: string;
    context?: any;
  }
  export interface PopWindowReturnInfo {
    sender: any;
    dialogResult: 'ok' | 'cancel' | 'close' | 'open' | 'load';
    formHelper: any;
    context?: any;
  }
  export interface DataTableSchemaField {
    name: string | undefined;
    capiton?: string | undefined;
    defaultValue?: any;
    editable?: boolean | undefined;
    nullable?: boolean | undefined;
    parse?: Function | undefined;
    type?: 'string' | 'boolean' | 'number' | 'datetime';
    required?: boolean | undefined;
    min?: any;
    max?: any;
    maxLength?: any;
    [rule: string]: any;
  }
  export interface DataTableSchemaFields {
    [index: string]: DataTableSchemaField;
  }
  export interface DataTableChangeEvent {
    sender: any;
    field?: string | undefined;
    value?: any;
    action?: string | undefined;
    index?: number | undefined;
    items?: any;
  }
  export interface DataTableOptions {
    data?: any;
    filter?: any;
    schema?: DataTableSchemaFields | undefined;
    change?(e: DataTableChangeEvent): void;
  }

}

declare module "ERX/ErFormToolbar" {
  const _default: import("vue").DefineComponent<{
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    showPageButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPrintButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showRefreshButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddCopyButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showDeleteButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showSaveButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toolbarClick: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    height: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    showPageButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPrintButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showRefreshButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddCopyButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showDeleteButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showSaveButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }>> & {
    onToolbarClick?: ((...args: any[]) => any) | undefined;
  }, {
    height: string;
    showPageButton: boolean;
    showPrintButton: boolean;
    showRefreshButton: boolean;
    showAddButton: boolean;
    showAddCopyButton: boolean;
    showDeleteButton: boolean;
    showSaveButton: boolean;
  }, {}>;
  export default _default;

}
declare module "ERX/ErGrid" {
  import { ER } from 'ERX/Er';
  const _default: import("vue").DefineComponent<{
    erFormHelperProp: {
      type: typeof ER.FormHelper;
      default: null;
      require: boolean;
    };
    configId: {
      type: StringConstructor;
      default: string;
    };
    toolbarOptions: {
      type: any;
      default: () => void;
    };
    options: {
      type: any;
      default: () => void;
    };
  }, {
    erGrid: any;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cellClicked: (...args: any[]) => void;
    ErGridReady: (...args: any[]) => void;
    cellClick: (...args: any[]) => void;
    cellDoubleClick: (...args: any[]) => void;
    rowClick: (...args: any[]) => void;
    rowDoubleClick: (...args: any[]) => void;
    cellDoubleClicked: (...args: any[]) => void;
    rowClicked: (...args: any[]) => void;
    rowDoubleClicked: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    erFormHelperProp: {
      type: typeof ER.FormHelper;
      default: null;
      require: boolean;
    };
    configId: {
      type: StringConstructor;
      default: string;
    };
    toolbarOptions: {
      type: any;
      default: () => void;
    };
    options: {
      type: any;
      default: () => void;
    };
  }>> & {
    onErGridReady?: ((...args: never) => any) | undefined;
    onCellClicked?: ((...args: any[]) => any) | undefined;
    onCellClick?: ((...args: any[]) => any) | undefined;
    onCellDoubleClick?: ((...args: any[]) => any) | undefined;
    onRowClick?: ((...args: any[]) => any) | undefined;
    onRowDoubleClick?: ((...args: any[]) => any) | undefined;
    onCellDoubleClicked?: ((...args: any[]) => any) | undefined;
    onRowClicked?: ((...args: any[]) => any) | undefined;
    onRowDoubleClicked?: ((...args: any[]) => any) | undefined;
  }, {
    toolbarOptions: any;
    configId: string;
    erFormHelperProp: ER.FormHelper;
    options: any;
  }, {}>;
  export default _default;

}
declare module "ERX/ErLayout" {
  import { ER } from 'ERX/Er';
  const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    layoutName: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    erFormHelperProp: {
      type: typeof ER.FormHelper;
      default: null;
      require: boolean;
    };
    configId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    configCaption: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    options: {
      type: ObjectConstructor;
      default: () => void;
      require: boolean;
    };
    showGroupBorder: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    allowCollapse: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    displayRows: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    showQueryButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showFormToolbar: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPageButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPrintButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showRefreshButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddCopyButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showDeleteButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showSaveButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    autoBind: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    bindModel: {
      type: any;
      default: undefined;
      require: boolean;
    };
    labelAlignTop: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toolbarClick: (...args: any[]) => void;
    QueryClick: (...args: any[]) => void;
    DisplayAllClick: (...args: any[]) => void;
    loaded: (...args: any[]) => void;
    toolbarFirstClick: (...args: any[]) => void;
    toolbarPreClick: (...args: any[]) => void;
    toolbarNextClick: (...args: any[]) => void;
    toolbarLastClick: (...args: any[]) => void;
    toolbarPrintClick: (...args: any[]) => void;
    toolbarRefreshClick: (...args: any[]) => void;
    toolbarAddClick: (...args: any[]) => void;
    toolbarAddCopyClick: (...args: any[]) => void;
    toolbarDeleteClick: (...args: any[]) => void;
    toolbarSaveClick: (...args: any[]) => void;
    groupButtonClick: (...args: any[]) => void;
    itemClick: (...args: any[]) => void;
    itemDbclick: (...args: any[]) => void;
    itemButtonClick: (...args: any[]) => void;
    valueChanged: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    layoutName: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    erFormHelperProp: {
      type: typeof ER.FormHelper;
      default: null;
      require: boolean;
    };
    configId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    configCaption: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    options: {
      type: ObjectConstructor;
      default: () => void;
      require: boolean;
    };
    showGroupBorder: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    allowCollapse: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    displayRows: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    showQueryButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showFormToolbar: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPageButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showPrintButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showRefreshButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showAddCopyButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showDeleteButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    showSaveButton: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    autoBind: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
    bindModel: {
      type: any;
      default: undefined;
      require: boolean;
    };
    labelAlignTop: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }>> & {
    onToolbarClick?: ((...args: any[]) => any) | undefined;
    onQueryClick?: ((...args: never) => any) | undefined;
    onDisplayAllClick?: ((...args: never) => any) | undefined;
    onLoaded?: ((...args: any[]) => any) | undefined;
    onToolbarFirstClick?: ((...args: any[]) => any) | undefined;
    onToolbarPreClick?: ((...args: any[]) => any) | undefined;
    onToolbarNextClick?: ((...args: any[]) => any) | undefined;
    onToolbarLastClick?: ((...args: any[]) => any) | undefined;
    onToolbarPrintClick?: ((...args: any[]) => any) | undefined;
    onToolbarRefreshClick?: ((...args: any[]) => any) | undefined;
    onToolbarAddClick?: ((...args: any[]) => any) | undefined;
    onToolbarAddCopyClick?: ((...args: any[]) => any) | undefined;
    onToolbarDeleteClick?: ((...args: any[]) => any) | undefined;
    onToolbarSaveClick?: ((...args: any[]) => any) | undefined;
    onGroupButtonClick?: ((...args: any[]) => any) | undefined;
    onItemClick?: ((...args: any[]) => any) | undefined;
    onItemDbclick?: ((...args: any[]) => any) | undefined;
    onItemButtonClick?: ((...args: any[]) => any) | undefined;
    onValueChanged?: ((...args: any[]) => any) | undefined;
  }, {
    showPageButton: boolean;
    showPrintButton: boolean;
    showRefreshButton: boolean;
    showAddButton: boolean;
    showAddCopyButton: boolean;
    showDeleteButton: boolean;
    showSaveButton: boolean;
    configId: string;
    erFormHelperProp: ER.FormHelper;
    options: Record<string, any>;
    layoutName: string;
    configCaption: string;
    showGroupBorder: boolean;
    allowCollapse: boolean;
    displayRows: number;
    showQueryButton: boolean;
    showFormToolbar: boolean;
    autoBind: boolean;
    bindModel: any;
    labelAlignTop: boolean;
  }, {}>, {
    borderSlot?(_: {}): any;
  }>;
  export default _default;
  type __VLS_WithTemplateSlots<T, S> = T & {
    new(): {
      $slots: S;
    };
  };

}
declare module "ERX/ErPopFree" {
  import { ER } from 'ERX/Er';
  const _default: import("vue").DefineComponent<{
    popFreeHelperProp: {
      type: typeof ER.PopFreeHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    OkClick: (...args: any[]) => void;
    CancelClick: (...args: any[]) => void;
    Closed: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    popFreeHelperProp: {
      type: typeof ER.PopFreeHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
  }>> & {
    onOkClick?: ((...args: never) => any) | undefined;
    onCancelClick?: ((...args: never) => any) | undefined;
    onClosed?: ((...args: never) => any) | undefined;
  }, {
    popFreeHelperProp: ER.PopFreeHelper;
    formWidth: number;
    formHeight: number;
  }, {}>;
  export default _default;

}
declare module "ERX/ErPopQuery" {
  import { ER } from 'ERX/Er';
  const _default: import("vue").DefineComponent<{
    popQueryHelperProp: {
      type: typeof ER.PopQueryHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    OkClick: (...args: any[]) => void;
    CancelClick: (...args: any[]) => void;
    ClearClick: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    popQueryHelperProp: {
      type: typeof ER.PopQueryHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
  }>> & {
    onOkClick?: ((...args: never) => any) | undefined;
    onCancelClick?: ((...args: never) => any) | undefined;
    onClearClick?: ((...args: never) => any) | undefined;
  }, {
    popQueryHelperProp: ER.PopQueryHelper;
    formWidth: number;
    formHeight: number;
  }, {}>;
  export default _default;
}
declare module "ERX/ErPopWindow" {
  import { ER } from 'ERX/Er';
  const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    popWindowHelperProp: {
      type: typeof ER.PopWindowHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    showFooter: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    OkClick: (...args: any[]) => void;
    CancelClick: (...args: any[]) => void;
    Closed: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    popWindowHelperProp: {
      type: typeof ER.PopWindowHelper;
      default: null;
      require: boolean;
    };
    formWidth: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    formHeight: {
      type: NumberConstructor;
      default: number;
      require: boolean;
    };
    showFooter: {
      type: BooleanConstructor;
      default: boolean;
      require: boolean;
    };
  }>> & {
    onOkClick?: ((...args: never) => any) | undefined;
    onCancelClick?: ((...args: never) => any) | undefined;
    onClosed?: ((...args: never) => any) | undefined;
  }, {
    formWidth: number;
    formHeight: number;
    popWindowHelperProp: ER.PopWindowHelper;
    showFooter: boolean;
  }, {}>, {
    customComponent?(_: {}): any;
  }>;
  export default _default;
  type __VLS_WithTemplateSlots<T, S> = T & {
    new(): {
      $slots: S;
    };
  };
}
declare module "ERX/ErMenuQuery" {
  import { ER } from 'ERX/Er';
  const _default: import("vue").DefineComponent<{
    formConfigId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    formParas: {
      type: ObjectConstructor;
      default: undefined;
      require: boolean;
    };
    override: {
      type: ArrayConstructor;
      default: () => never[];
      require: boolean;
    };
  }, {
    erFormHelper: ER.FormHelper;
    fnDoClick: (e: any) => Promise<void>;
    queryInfo: (msgFlag?: boolean) => void;
    queryClick: () => Promise<void>;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    load: (...args: any[]) => void;
    "f1-do": (...args: any[]) => void;
    "f2-do": (...args: any[]) => void;
    "f3-do": (...args: any[]) => void;
    "f4-do": (...args: any[]) => void;
    "f5-do": (...args: any[]) => void;
    "f6-do": (...args: any[]) => void;
    "f7-do": (...args: any[]) => void;
    "f8-do": (...args: any[]) => void;
    "f9-do": (...args: any[]) => void;
    "f10-do": (...args: any[]) => void;
    "f11-do": (...args: any[]) => void;
    "f12-do": (...args: any[]) => void;
    "close-click": (...args: any[]) => void;
    mainGridClick: (...args: any[]) => void;
    mainGridDoubleClick: (...args: any[]) => void;
    mainGridFocusChanged: (...args: any[]) => void;
    mainGridToolbarClick: (...args: any[]) => void;
    mainGridCellButtonClick: (...args: any[]) => void;
    detailGridClick: (...args: any[]) => void;
    detailGridDoubleClick: (...args: any[]) => void;
    detailGridFocusChanged: (...args: any[]) => void;
    detailGridToolbarClick: (...args: any[]) => void;
    detailGridCellButtonClick: (...args: any[]) => void;
    filterButtonClick: (...args: any[]) => void;
    filterValueChanged: (...args: any[]) => void;
    detailButtonClick: (...args: any[]) => void;
    detailValueChanged: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    formConfigId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    formParas: {
      type: ObjectConstructor;
      default: undefined;
      require: boolean;
    };
    override: {
      type: ArrayConstructor;
      default: () => never[];
      require: boolean;
    };
  }>> & {
    onLoad?: ((...args: any[]) => any) | undefined;
    "onF1-do"?: ((...args: any[]) => any) | undefined;
    "onF2-do"?: ((...args: any[]) => any) | undefined;
    "onF3-do"?: ((...args: any[]) => any) | undefined;
    "onF4-do"?: ((...args: any[]) => any) | undefined;
    "onF5-do"?: ((...args: any[]) => any) | undefined;
    "onF6-do"?: ((...args: any[]) => any) | undefined;
    "onF7-do"?: ((...args: any[]) => any) | undefined;
    "onF8-do"?: ((...args: any[]) => any) | undefined;
    "onF9-do"?: ((...args: any[]) => any) | undefined;
    "onF10-do"?: ((...args: any[]) => any) | undefined;
    "onF11-do"?: ((...args: any[]) => any) | undefined;
    "onF12-do"?: ((...args: any[]) => any) | undefined;
    "onClose-click"?: ((...args: any[]) => any) | undefined;
    onMainGridClick?: ((...args: any[]) => any) | undefined;
    onMainGridDoubleClick?: ((...args: any[]) => any) | undefined;
    onMainGridFocusChanged?: ((...args: any[]) => any) | undefined;
    onMainGridToolbarClick?: ((...args: any[]) => any) | undefined;
    onMainGridCellButtonClick?: ((...args: any[]) => any) | undefined;
    onDetailGridClick?: ((...args: any[]) => any) | undefined;
    onDetailGridDoubleClick?: ((...args: any[]) => any) | undefined;
    onDetailGridFocusChanged?: ((...args: any[]) => any) | undefined;
    onDetailGridToolbarClick?: ((...args: any[]) => any) | undefined;
    onDetailGridCellButtonClick?: ((...args: any[]) => any) | undefined;
    onFilterButtonClick?: ((...args: any[]) => any) | undefined;
    onFilterValueChanged?: ((...args: any[]) => any) | undefined;
    onDetailButtonClick?: ((...args: any[]) => any) | undefined;
    onDetailValueChanged?: ((...args: any[]) => any) | undefined;
  }, {
    formConfigId: string;
    formParas: Record<string, any>;
    override: unknown[];
  }, {}>;
  export default _default;

}
declare module "ERX/ErMenuQueryEx" {
  import { ER } from 'ERX/Er';
  const _default: import("vue").DefineComponent<{
    formConfigId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    formParas: {
      type: ObjectConstructor;
      default: undefined;
      require: boolean;
    };
    override: {
      type: ArrayConstructor;
      default: () => never[];
      require: boolean;
    };
  }, {
    erFormHelper: ER.FormHelper;
    fnDoClick: (e: any) => Promise<void>;
    queryInfo: (msgFlag?: boolean) => void;
    queryClick: () => Promise<void>;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    load: (...args: any[]) => void;
    "f1-do": (...args: any[]) => void;
    "f2-do": (...args: any[]) => void;
    "f3-do": (...args: any[]) => void;
    "f4-do": (...args: any[]) => void;
    "f5-do": (...args: any[]) => void;
    "f6-do": (...args: any[]) => void;
    "f7-do": (...args: any[]) => void;
    "f8-do": (...args: any[]) => void;
    "f9-do": (...args: any[]) => void;
    "f10-do": (...args: any[]) => void;
    "f11-do": (...args: any[]) => void;
    "f12-do": (...args: any[]) => void;
    "close-click": (...args: any[]) => void;
    mainGridClick: (...args: any[]) => void;
    mainGridDoubleClick: (...args: any[]) => void;
    mainGridFocusChanged: (...args: any[]) => void;
    mainGridToolbarClick: (...args: any[]) => void;
    mainGridCellButtonClick: (...args: any[]) => void;
    detailGridClick: (...args: any[]) => void;
    detailGridDoubleClick: (...args: any[]) => void;
    detailGridFocusChanged: (...args: any[]) => void;
    detailGridToolbarClick: (...args: any[]) => void;
    detailGridCellButtonClick: (...args: any[]) => void;
    filterButtonClick: (...args: any[]) => void;
    filterValueChanged: (...args: any[]) => void;
    detailButtonClick: (...args: any[]) => void;
    detailValueChanged: (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    formConfigId: {
      type: StringConstructor;
      default: string;
      require: boolean;
    };
    formParas: {
      type: ObjectConstructor;
      default: undefined;
      require: boolean;
    };
    override: {
      type: ArrayConstructor;
      default: () => never[];
      require: boolean;
    };
  }>> & {
    onLoad?: ((...args: any[]) => any) | undefined;
    "onF1-do"?: ((...args: any[]) => any) | undefined;
    "onF2-do"?: ((...args: any[]) => any) | undefined;
    "onF3-do"?: ((...args: any[]) => any) | undefined;
    "onF4-do"?: ((...args: any[]) => any) | undefined;
    "onF5-do"?: ((...args: any[]) => any) | undefined;
    "onF6-do"?: ((...args: any[]) => any) | undefined;
    "onF7-do"?: ((...args: any[]) => any) | undefined;
    "onF8-do"?: ((...args: any[]) => any) | undefined;
    "onF9-do"?: ((...args: any[]) => any) | undefined;
    "onF10-do"?: ((...args: any[]) => any) | undefined;
    "onF11-do"?: ((...args: any[]) => any) | undefined;
    "onF12-do"?: ((...args: any[]) => any) | undefined;
    "onClose-click"?: ((...args: any[]) => any) | undefined;
    onMainGridClick?: ((...args: any[]) => any) | undefined;
    onMainGridDoubleClick?: ((...args: any[]) => any) | undefined;
    onMainGridFocusChanged?: ((...args: any[]) => any) | undefined;
    onMainGridToolbarClick?: ((...args: any[]) => any) | undefined;
    onMainGridCellButtonClick?: ((...args: any[]) => any) | undefined;
    onDetailGridClick?: ((...args: any[]) => any) | undefined;
    onDetailGridDoubleClick?: ((...args: any[]) => any) | undefined;
    onDetailGridFocusChanged?: ((...args: any[]) => any) | undefined;
    onDetailGridToolbarClick?: ((...args: any[]) => any) | undefined;
    onDetailGridCellButtonClick?: ((...args: any[]) => any) | undefined;
    onFilterButtonClick?: ((...args: any[]) => any) | undefined;
    onFilterValueChanged?: ((...args: any[]) => any) | undefined;
    onDetailButtonClick?: ((...args: any[]) => any) | undefined;
    onDetailValueChanged?: ((...args: any[]) => any) | undefined;
  }, {
    formConfigId: string;
    formParas: Record<string, any>;
    override: unknown[];
  }, {}>;
  export default _default;
}
declare module "ERX/ErSelect" {
  const _default: import("vue").DefineComponent<{
    modelValue: {
      type: (ArrayConstructor | StringConstructor | NumberConstructor)[];
      default: undefined;
    };
    dataSource: {
      type: any[];
      default: () => never[];
    };
    columns: {
      type: any[];
      default: () => never[];
    };
    readonly: {
      type: BooleanConstructor;
      default: boolean;
    };
    multiple: {
      type: BooleanConstructor;
      default: boolean;
    };
    options: {
      type: any;
      default: () => void;
    };
  }, {
    gridApi: any;
  }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
  }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
      type: (ArrayConstructor | StringConstructor | NumberConstructor)[];
      default: undefined;
    };
    dataSource: {
      type: any[];
      default: () => never[];
    };
    columns: {
      type: any[];
      default: () => never[];
    };
    readonly: {
      type: BooleanConstructor;
      default: boolean;
    };
    multiple: {
      type: BooleanConstructor;
      default: boolean;
    };
    options: {
      type: any;
      default: () => void;
    };
  }>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
  }, {
    readonly: boolean;
    columns: any;
    dataSource: any;
    multiple: boolean;
    options: any;
    modelValue: string | number | unknown[];
  }, {}>;
  export default _default;

}
declare module "ERX/Er" {
  import { EI, ILoadingOptions } from 'EIX/ei';
  import { DataTableOptions, DataTableSchemaFields, DataTableSchemaField, PopQueryReturnInfo, PopFreeReturnInfo, PopWindowReturnInfo } from 'ERX/er-type';
  import { Dayjs } from 'dayjs';
  import { BodyDropPivotTarget, ColumnApi, GridApi, IRowNode, GridOptions } from '@ag-grid-community/core'
  export namespace ER {
    class Class {
      protected _events: {};
      constructor();
    }
    class Core {
      /**
       * 生成guid
       * @returns string
       */
      static guid(): string;
      /**
       * jQuery
       * @returns jQuery
       */
      static jQuery(selector: any): any;
      /**
       * 将对象类型转换成字符型，undefined及null及空数组返回空字符串，其他等于String(obj)
       * @param obj
       * @param trim 是否trim
       * @returns string
       */
      static toString(obj: any, trim?: boolean, caseType?: 'default' | 'toLower' | 'toUpper'): string;
      /**
       * 将对象类型转换成数值性
       * @param obj
       * @returns Number
       */
      static toNumber(obj: any): number;
      /**
       * 将对象类型转换成布尔值
       * @param obj
       * @returns Number
       */
      static toBoolean(obj: any): boolean;
      /**
       * 根据字符串获取日期时间(一般为[yyyyMMdd][yyyyMMddHHmmss]及类似[yyyy-MM-dd HH:mm:ss]的通用格式
       * @param obj 传入字符串或日期
       * @returns 转换后的日期
       */
      static toDateTime(obj: Date | String | Dayjs, type?: 'Date' | 'Dayjs'): any;
      /**
       * 获取日期格式化后的字符串
       * @param date 传入日期
       * @param formatString 格式化
       * @returns 格式化后的字符串
       */
      static getDateTimeFormatString(date: Date | Dayjs | String | undefined, formatString?: string): string;
      /**
       * 判断对象是否为空,字符串Trim()后lenght为零,数组长度为0时
       * @param obj
       * @returns boolean
       */
      static isNullOrEmpty(obj: any): boolean;
      /**
       * 根据长度和精度获取最大数值
       * @param maxlength 长度
       * @param precision 精度
       * @returns 最大数值
       */
      static getMaxNumber(totalLength: number, decimalLength?: number): number;
      /**
       * 执行脚本代替eval
       * @param data 数据
       * @param expression 脚本
       * @returns 是否满足
       */
      static excuteScript(script: string): any;
      /**
       * 根据数据及表达式脚本判断是否满足
       * @param data 数据
       * @param expression 脚本
       * @returns 是否满足
       */
      static checkExpressionValid(data: {
        [key: string]: any;
      }, expression: string): boolean;
      /**
       * 获取文本的长度
       * @param text 文本
       * @returns 长度
       */
      static getTextWidth(text: string, font?: string): number;
      /**
      * 根据一个数值获取颜色
      * @param argb 数值
      * @returns string
      */
      static ColorFromArgb(argb: number): string;
      /**
       * 根据传入的数组变量替换对应位置占位符{n}后的字符串
       * @param orginalString
       * @param args 替换占位符{n}的数组
       * @returns newString
       */
      static stringFormat(orginalString: string, ...args: any[]): string;
      /**
      * 设置Model的值
      * @param model Model
      * @param values 需要设置的值[单个值或Json]
      * @param itemCodes 需要设置的字段
      * @returns void
      */
      static setModelValue(model: ER.Model, values: any, ...itemCodes: string[]): void;
      /**
       * 获取Grid的列
       * @param grid grid
       * @param colId 配置的列名(未传入时，返回焦点列)
       * @returns GridColumn
       */
      static getGridColumn(grid: any, itemCode?: string): any;
      /**
       * 获取Grid的选中行[无勾选框时为当前行]
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns ER.Model[]
       */
      static getGridSelectRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的选中行[无勾选框时为当前行]EiBlock
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      static getGridSelectRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的当前焦点行
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns ER.Model or Json
       */
      static getGridCurrentRow(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any;
      /**
       * 获取Grid的当前焦点行Json
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns json
       */
      static getGridCurrentRowAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的选中行[必须在有勾选列的情况下]
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns ER.Model[]
       */
      static getGridCheckedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的选中行的数据Json格式[必须在有勾选列的情况下]
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Json array
       */
      static getGridCheckedRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已删除的行
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns Json array
       */
      static getGridDeletedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已删除的行Block
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Block
       */
      static getGridDeletedRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已修改的行Json
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns Json array
       */
      static getGridModifyRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已修改的行Block
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Block
       */
      static getGridModifyRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已新增的行
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns Json array
       */
      static getGridCreatedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已新增的行Block
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Block
       */
      static getGridCreatedRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已新增的行
       * @param grid
       * @param toJson 将对象转成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Json array
       */
      static getGridAllRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已新增的行Block
       * @param grid
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Block
       */
      static getGridAllRowsAsBlock(grid: any, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的变更集并添加到EIInfo[块名分别为:{tableName}_DELETE,{tableName}_MODIFY,{tableName}_ADD]
       * @param grid
       * @param tableName 相关表名[必须项]
       * @param EIInfo
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EIInfo
       */
      static getGridChangedRowsAsEiInfo(grid: any, tableName?: string, inInfo?: EI.EIInfo, onlyGridColumns?: boolean): EI.EIInfo;
      /**
       * 获取Grid的的行
       * @param grid grid对象
       * @param type 行类型
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns ObservableObject or Json array
       */
      static getGridRows(grid: any, type: 'current' | 'select' | 'checked' | 'add' | 'modify' | 'delete' | 'all', toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的的行
       * @param grid grid对象
       * @param type 行类型
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      static getGridRowsAsBlock(grid: any, type: 'current' | 'select' | 'checked' | 'add' | 'modify' | 'delete' | 'all', onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 从一个GridDataRow向另一个GridDataRow复制值
       * @param newDataRow
       * @param fromDataRow
       * @returns newDataRow
       */
      static mergeGridDataRow(newDataRow: Model, fromDataRow: any, ignoreWhenExistValue?: boolean, setAllDirty?: boolean): Model;
      /**
       * Merge数据到DataTable
       * @param data 原数据
       * @param dataTable DataTable
       * @param clearExistData 是否清空已有数据，默认为true
       * @returns total
       */
      static mergeDataToDataTable(data: any, dataTable: DataTable, clearExistData?: boolean): number;
      /**
       * 将数据绑定到Grid
       * @param data
       * @param grid
       * @returns rowsCount
       */
      static mergeDataToGrid(data: any, grid: any, clearExistData?: boolean): number;
      /**
       * EIInfo的数据绑定到Grid
       * @param grid
       * @param block EI.EiBlock
       * @returns rowsCount
       */
      static mergeEiBlockToGrid(block: EI.EiBlock, grid: any, clearExistData?: boolean): number;
      /**
       * 清除Grid的数据
       * @param grid
       * @param data
       * @returns this
       */
      static clearGridData(grid: any): Core;
      /**
       * 根据日期通用格式及一些预置字符格式转换成日期
       * @param dateString 传入字符串或日期
       * @returns 转换后的日期
       */
      static getDateTimeByString(dateString?: any, type?: 'Date' | 'Dayjs'): any;
      /**
       * 根据系统预置字符替换特殊占位字符
       * @param formatString 传入字符串
       * @param companyCode 根据该账套替换相应的账套占位,为空时取默认当前账套
       * @returns 转换后的字符串
       */
      static getSystemFormatString(formatString: string, companyCode?: string, companyName?: string): string;
      /**
       * 数值格式化
       * @param value 传入值
       * @param formatType 格式化类型
       * @param formatString 格式化字符串
       * @param type type
       * @returns formatValue
       */
      static formatNumberValue(value: any, formatType: any, formatString: any, type?: 'toNumber' | 'toString'): any;
      /**
       * 数值格式化
       * @param value 传入值
       * @param formatType 格式化类型
       * @param formatString 格式化字符串
       * @param type type
       * @returns formatValue
       */
      static formatDateTimeValue(value: any, formatString?: 'yyyy-MM-dd' | 'yyyy-MM-dd HH:mm:ss', type?: 'toDate' | 'toString'): any;
      /**
       * 数据类型转换，根据datasource schema进行强类型弱类型互相转换
       * @param data 数据
       * @param dataTable DataTable
       * @param type 转换类型
       * @returns data
       */
      static convertDataType(data: EI.EiBlock | any[], dataTable: DataTable, type: 'strongly' | 'weakly', include?: 'datetime' | 'boolean' | 'all'): any;
      /**
       * 根据数据生成EiBlock对象
       * @param data 数据
       * @param tableName BlockName
       * @returns EiBlock
       */
      static buildEiBlock(data?: any[], tableName?: string): EI.EiBlock;
      /**
       * 将EJson对象数组添加到EiBlock
       * @param data
       * @param block
       * @returns EiBlock
       */
      static addJsonToEiBlock(data: {
        [key: string]: any;
      }[], block?: any): EI.EiBlock;
      /**
       * 动态SQL查询
       * @param partition 服务分区
       * @param svcName 自定义服务名称，传空时默认系统服务
       * @param sqlScriptArray SQL脚本数组
       * @returns Promise EI.EIInfo
       */
      static querySql(serverPartition: string, svcName: string, ...sqlScriptArray: string[]): Promise<EI.EIInfo>;
      /**
       * 根据SQL脚本获取前n条数据信息
       * @param partition 服务分区
       * @param sql 查询脚本
       * @param topRows 数据条数
       * @returns Promise EI.EIInfo
       */
      static queryTopRows(serverPartition: string, sql: string, topRows: number): Promise<EI.EIInfo>;
      /**
       * 根据后台服务及传入参数查询数据
       * @param partition 服务分区
       * @param svcName 服务名称
       * @param paras 参数数据
       * @param customFilter 自定义条件脚本
       * @param dataSourceSet 相关数据集
       * @param tableName 相关表
       * @returns Promise EI.EIInfo
       */
      static queryDataByService(partition: string, svcName: string, paras?: {
        queryFilter?: {
          ITEM_CODE: string;
          FIELD_NAME: string;
          ORIGIN_CODE: string;
          OPERATOR: string;
          PARA_GROUP: string;
          SQL_CONTENT: string;
          DATA_TYPE: string;
          OP_VALUE: string | number;
        }[];
        customFilter?: string;
        dataSet?: DataSet;
        tableName?: string;
      }): Promise<unknown>;
      /**
       * 删除Grid的选中行[无勾选框时为当前行]
       * @param grid Grid
       * @param confirmMsg 是否提示确认
       */
      static deleteGridRows(grid: any, confirmMsg?: boolean, rows?: any[]): Promise<boolean>;
      /**
       * 设置grid的焦点
       * @param grid Grid
       * @param rowIndex rowIndex
       * @param colKey colKey ｜ Column
       */
      static setGridFocusedCell(grid: any, rowIndex?: number, colKey?: any): void;
      /**
       * 将数据合并到ER.Model
       * @param resultModel ER.Model
       * @param orgModel 传入数据
       * @param ignoreExistValue 是否忽略已存在的非空值
       * @param setAllDirty 是否记录所有的Dirty值
       * @returns ER.Model
       */
      static mergeModel(resultModel: Model, orgModel: {
        [key: string]: any;
      }, ignoreExistValue?: boolean, setAllDirty?: boolean): Model;
      /**
       * 重命名数据列名或键名
       * @param orgData 数据
       * @param rules 更改前后列名或键名
       * @returns 修改后的数据
       */
      static renameJsonKey(orgData: EI.EiBlock | Array<{
        [key: string]: any;
      }>, rules: Array<{
        oldKey: string;
        newKey: string;
      }>): EI.EiBlock | Array<{
        [key: string]: any;
      }>;
      /**
       * 在页面上侧中间显示信息栏,三种类型['info' | 'warning' | 'error']
       * autoHideAfter 毫秒后自动消失
       * @param info 显示内容
       */
      static message(info: {
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        autoHideAfter?: number;
      }): void;
      /**
       * 在页面上侧中间显示提示信息栏[2000ms后自动消失]
       * @param text 显示文本内容
       */
      static messageInfo(text: string): void;
      /**
       * 在页面上侧中间显示提示信息栏
       * @param text 显示文本内容,默认为[操作成功]
       */
      static messageSuccess(text?: string): void;
      /**
       * 在页面上侧中间显示警告信息栏[3000ms后自动消失]
       * @param text 显示文本内容
       */
      static messageWarning(text: string): void;
      /**
       * 在页面上侧中间显示错误信息栏[5000ms后自动消失]
       * @param text 显示文本内容
       */
      static messageError(text: string): void;
      /**
       * 弹出Confirm确认对话框
       * @param message 显示的对话内容，为空时默认[是否确认操作?]
       * @returns Promise boolean
       */
      static messageConfirm(message?: string | {
        title: string;
        content: any;
        okType: string;
      }): Promise<boolean>;
      /**
       * 四舍五入数值
       * @param num 原数值
       * @returns 四舍五入后的新数值
       */
      static round(num: number, decimals: number): number;
      /**
       * 判断对象是否是一个Jquery对象
       * @param obj 要判断的对象
       * @returns boolean
       */
      static isJQueryHTMLElement(obj: any): boolean;
      /**
       * 创建一个进度条div
       * @param value 当前值
       * @param max 最大值
       * @param labelText 显示的内容
       * @param progressColor 进度条颜色
       * @param labelColor 显示的内容颜色
       * @returns div
       */
      static createProgressBar(value: number, max: number, labelText?: string, progressColor?: string, labelColor?: string): any;
      /**
       * 设置localStorage
       * @param key 键
       * @param value 值
       * @returns Storage
       */
      static setLocalStorage(key: string, value: any): Storage;
      /**
       * 通用防抖函数
       * @param func 需要执行的函数
       * @param delay 延迟执行的时间
       * @returns Function
       */
      static debounce<A extends any[], R>(func: (...args: A) => R, delay?: number): (...args: A) => void;
      /**
       * 获取localStorage
       * @param key 键
       * @param removeAfterGet 获取值后删除相应的key
       * @returns any
       */
      static getLocalStorage(key: string, removeAfterGet?: boolean): any;
      /**
       * 获取画面传递参数
       * @param formName 画面名
       * @param removeAfterGet 获取值后删除相应的参数缓存
       * @returns any
       */
      static getCallFormParas(formName: string, removeAfterGet?: boolean): any;
      /**
       * 打开新的主页面
       * @param formName 注册画面名称
       * @param paras 画面之间传递参数[localStorage]
       * @returns void
       */
      /**
       * 复制文本到粘贴板
       * @param text 文本
       * @returns Promise<void>
       */
      static copyText(text: string): Promise<unknown>;
      /**
       * 读取粘贴板的文本
       * @returns Promise<string>
       */
      static readClipboardText(): Promise<string>;
      /**
       * 调用后台服务service
       * @param partition 服务分区
       * @param svcName 服务名称
       * @param data 传入数据
       * @param showLoading 是否显示loading
       * @param messageError 错误时是否显示Error信息
       * @param showLoadingAnimotion 是否显示loading动画
       * @param serviceTransformer 请求/响应数据处理回调函数
       * @returns Promise EI.EIInfo
       */
      static callService(partition: string, svcName: string, data: EI.EIInfo, showLoading?: boolean | ILoadingOptions, messageError?: boolean, showLoadingAnimotion?: boolean, serviceTransformer?: {
        autoId: boolean;
        autoColumnToUpper: boolean;
      }): Promise<EI.EIInfo>;
      /**
         * 调用授权分区service
         * @param svcName 服务名称
         * @param data 传入数据
         * @param showLoading 是否显示loading
         * @param messageError 错误时是否显示Error信息
         * @param showLoadingAnimotion 是否显示loading动画
         * @param serviceTransformer 请求/响应数据处理回调函数
         * @returns Promise EI.EIInfo
         */
      static callMasterEPService(svcName: string, data: EI.EIInfo, showLoading?: boolean, messageError?: boolean, showLoadingAnimotion?: boolean, serviceTransformer?: {
        autoId: boolean;
        autoColumnToUpper: boolean;
      }): Promise<EI.EIInfo>;
    }
    class SysInfo {
      /**
       * 当前应用名称
       * @returns AppName
       */
      static get AppName(): string;
      /**
       * 当前账套代码
       * @returns CompanyCode
       */
      static get CompanyCode(): string;
      /**
       * 当前账套名称
       * @returns CompanyName
       */
      static get CompanyName(): string;
      /**
       * 当前用户名
       * @returns UserId
       */
      static get UserId(): string;
      /**
       * 当前用户姓名
       * @returns UserName
       */
      static get UserName(): string;
      /**
       * 当前服务器分区
       * @returns Partiton
       */
      static get Partiton(): string;
      /**
       * 当前画面代码
       * @returns FormName
       */
      static get FormName(): string;
      /**
       * GridCheckColumnFieldName
       * @returns GridCheckColumnFieldName
       */
      static get GridCheckColumnFieldName(): string;
      /**
       * 当前画面参数
       * @returns FormParas
       */
      static get FormParas(): {};
    }
    class Be2SysParaInfo {
      private _partition;
      private _companyCode;
      private _serviceName;
      private _paraFilter?;
      private _initializeSuccessed;
      private _sysParasValue;
      get Partiton(): string;
      get CompanyCode(): string;
      get InitializeSuccessed(): boolean;
      get SysParasValue(): {
        [key: string]: any;
      };
      constructor(partition: string, paraFilter?: {
        ParaMoudule?: string;
        ParaCodes?: string | Array<string>;
      }, companyCode?: string, serviceName?: string);
      Initialize(serverPartition?: string, paraFilter?: {
        ParaMoudule?: string;
        ParaCodes?: string | Array<string>;
      }, companyCode?: string, serviceName?: string): Promise<unknown>;
      getParaValue(paraCode: string): string;
    }
    class SysGlobalVariables {
      /**
       * 设置系统全局变量[localStorage方式]
       * @param keyType 类型
       * @param key  键
       * @param value  值
       * @returns void
       */
      static setVariable(keyType: string, key: string, value: any): void;
      /**
       * 获取系统全局变量[localStorage方式]
       * @param keyType 类型
       * @param key  键
       * @param clearValue 获取完是否清空
       * @returns 值
       */
      static getVariable(keyType: string, key: string, clearValue?: boolean): any;
      /**
       * 清除系统全局变量[localStorage方式]
       * @param keyType 类型
       * @param key  键
       * @returns void
       */
      static clearVariable(keyType: string, key: string): void;
      /**
       * 判断系统全局变量是否存在[localStorage方式]
       * @param keyType 类型
       * @param key  键
       * @returns 是否为空
       */
      static isNullOrEmpty(keyType: string, key: string): boolean;
    }
    class Model extends Class {
      [key: string]: any;
      get schemaFields(): DataTableSchemaFields;
      dirty: boolean;
      dirtyFields: {};
      uid: string;
      isNew: boolean;
      private _schemaFields;
      constructor(jsonData?: {
        [key: string]: any;
      }, shcema?: DataTableSchemaFields);
      static getFieldDefaultValue(field: DataTableSchemaField): any;
      shouldSerialize(field: string): boolean;
      forEach(f: Function): void;
      toJSON(extendData?: {
        [key: string]: number | string;
      }): {
        [key: string]: any;
      };
      get(field: string): string extends infer T ? T extends string ? T extends keyof this ? this[T] : any : never : never;
      set(field: string, value: any): Model;
      setData(data: {
        [key: string]: any;
      }): Model;
      addField(...fields: DataTableSchemaField[]): Model;
      reomveField(...fields: DataTableSchemaField[]): Model;
      accept(jsonData?: {
        [key: string]: any;
      }, shcema?: DataTableSchemaFields): Model;
    }
    class DataTable {
      private _data;
      private _dataCopy;
      private _dataCreated;
      private _dataRemoved;
      private _options;
      private _currentModel;
      tableName: string;
      get options(): DataTableOptions;
      get rowCount(): number;
      get Current(): Model | undefined;
      constructor(options?: DataTableOptions);
      init(options: DataTableOptions): void;
      addField(...fields: DataTableSchemaField[]): DataTable;
      removeField(...fields: DataTableSchemaField[]): DataTable;
      get(uid: string): any;
      getRows(rowState: 'created' | 'updated' | 'removed' | 'unchanged' | 'original' | 'all', toJSON?: boolean): any[];
      at(index: number): Model | undefined;
      indexOf(model: Model): number;
      setCurrent(model: Model | undefined): void;
      insert(index: number, data: {}): Model;
      add(data?: {}): Model;
      import(data: any[], index?: number, asNewState?: boolean): Model[];
      remove(data: {} | {}[]): void;
      setRowState(data: Model, state: 'added' | 'updated' | 'unchanged'): void;
      clear(): DataTable;
      merge(data: any[], clearExistData?: boolean, asNewState?: boolean): Array<Model>;
      hasChanges(): boolean;
      acceptChanges(): DataTable;
      cancelChanges(): DataTable;
      totalCount(): number;
      data(data?: any[]): Array<Model>;
    }
    class DataSet {
      private dataSetName;
      dataTables: {
        [key: string]: DataTable;
      };
      relations: {
        [key: string]: any;
      };
      /**
       * 数据集名称
       * @returns Name
       */
      get Name(): string;
      constructor(name?: string);
      /**
       * 设置数据集名称
       * @param name 表名
       * @returns this
       */
      setName(name: string): DataSet;
      /**
       * 向数据集中添加数据表
       * @param tableName 表名
       * @param _dataTable 数据表
       * @returns this
       */
      addDataTable(tableName: string, _dataTable: DataTable): DataSet;
      /**
       * 根据表名移除数据集中的数据表
       * @param tableName 表名
       * @returns DataTable
       */
      removeDataTable(tableName: string): DataSet;
      /**
       * 重命名数据集中的数据表名称
       * @param oldTableName 原表名
       * @param newTableName 新表名
       * @returns this
       */
      renameDataTable(oldTableName: string, newTableName: string): DataSet;
      /**
       * Copy DataTable 包含数据
       * @param dataTable 数据表
       * @param newTableName 新表名
       * @returns DataTable
       */
      copyDataTable(dataTable: string | DataTable, newTableName?: string): DataTable;
      /**
       * Clone DataTable 不包含数据,只复制结构
       * @param dataTable 数据表
       * @param newTableName 新表名
       * @returns DataTable
       */
      cloneDataTable(dataTable: string | DataTable, newTableName?: string): DataTable;
      /**
       * 根据表名获取数据集中的数据表
       * @param tableName 表名
       * @returns DataTable
       */
      getDataTable(tableName: string): DataTable;
      /**
       * 根据DataTable获取对应的表名
       * @param tableName 表名
       * @returns DataTable
       */
      getTableName(dataTable: DataTable): string | undefined;
      /**
       * 清除数据表中的数据,不传表名时清除所有表的数据
       * @param tableNames 表名
       * @returns DataTable
       */
      clear(...tableNames: string[]): DataSet;
      /**
       * Merge数据
       * @param tableNames tableName
       * @param data 原数据
       * @param clearExistData 是否清空已有数据，默认为true
       * @returns this
       */
      mergeData(tableName: string, data: any, clearExistData?: boolean, asNewState?: boolean): DataSet;
      /**
       * 从EIInfo向DataSet Merge数据
       * @param inInfo tableName
       * @param tableName 为空时，按照表名进行Merge
       * @param clearExistData 是否清空已有数据，默认为true
       * @returns this
       */
      mergeDataFromEIInfo(inInfo: EI.EIInfo, tableName?: string, clearExistData?: boolean): DataSet;
      /**
       * 设置DataTable当前行对象
       * @param tableName 表名
       * @param dataObject 当前对象
       * @returns dataObject
       */
      getCurrentDataObject(tableName: string): Model | undefined;
      /**
       * 数据集包含的表数量
       * @returns 包含的表数量
       */
      tablesCount(): number;
      /**
       * 数据集中是否包含表tableName
       * @param tableName 表名
       * @returns 是否包含
       */
      contains(tableName: string): boolean;
      /**
       * 数据集是否为空
       * @returns 是否空
       */
      isEmpty(): boolean;
      /**
       * 数据集中的表是否有变动, 表名不传或者为空时表示所有表
       * @param tableName 表名
       * @returns 是否变动
       */
      hasChanges(tableName?: string): boolean;
      /**
       * 数据集中是否包含表关系
       * @param relationName 关系名称
       * @returns 是否包含
       */
      hasRelation(relationName: string): boolean;
    }
    /**
   * 低代码画面工具类
   */
    class FormHelper {
      /**
       * 工具类所属当前组件
       */
      get App(): undefined;
      /**
       * 画面配置所属一级模块代码[2位]
       */
      get ModuleName(): string;
      /**
       * 画面ID[自动生成的唯一标识]
       */
      get FormId(): string;
      /**
       * 画面配置代码
       */
      get FormName(): string;
      /**
       * 画面配置名称
       */
      get FormCaption(): string;
      /**
       * 画面配置宽度(弹出)
       */
      get FormWidth(): number;
      /**
       * 画面配置高度(弹出)
       */
      get FormHeight(): number;
      /**
       * 是否可以最大化(弹出)
       */
      get MaxmizeBox(): boolean;
      /**
       * 是否可以最小化(弹出)
       */
      get MinimizeBox(): boolean;
      /**
       * 是否可以拖动画面大小(弹出)
       */
      get Resizable(): boolean;
      /**
       * 画面初始化成功标志(1:成功;<=0:失败)
       */
      get InitializeFlag(): number;
      /**
       * 画面配置信息
       */
      get ConfigInfo(): any;
      /**
       * 系统配置信息
       */
      get SystemInfo(): {};
      /**
       * 下拉框绑定信息
       */
      get DropDownBindSource(): {};
      /**
       * 下拉框联动信息
       */
      get DropDownCascader(): {};
      /**
       * 画面相关Grid的Options对象信息
       */
      get GridOptions(): {};
      /**
       * 画面布局相关的必填项信息
       */
      get RequiredFields(): {};
      /**
       * 画面布局相关的条件必填项信息
       */
      get RequiredFieldsByCondition(): {};
      /**
      * 画面布局中字段项是否可见的信息
      */
      get FieldsVisibleInfo(): {};
      /**
      * Grid中允许合并的列信息
      */
      get AllowMergeColumnFields(): {};
      /**
       * 画面对应的数据集
       */
      get FormDataSet(): DataSet;
      /**
       * 画面数据集绑定关系信息
       */
      get FormBindingRelation(): {};
      /**
       * 画面授权按钮信息
       */
      get FormAuthButtons(): {};
      /**
       * 默认配置账套代码
       */
      get DefaultConfigCompanyCode(): string;
      /**
       * 默认配置账套名称
       */
      get DefaultConfigCompanyName(): string;
      /**
       * 画面注册服务分区
       */
      get ServerPartition(): string;
      /**
       * 自定义服务分区
       */
      get CustomPartition(): string;
      /**
       * 画面初始化自定义参数
       */
      get InitialConfiParas(): {};
      /**
       * 布局配置对应的当前账套代码
       */
      get CurrentConfigCompanyCode(): {
        [key: string]: string;
      };
      /**
       * 系统集团账套代码
       */
      get GroupCompanyCode(): string;
      /**
       * 系统集团账套名称
       */
      get GroupCompanyName(): string;
      /**
       *  Layout控件信息
       */
      get WidgetInstanceInfo(): {};
      /**
       *  开发者权限
       */
      get DevelopPermisson(): string;
      /**
       * 系统配置参数
       */
      SysDefinedParas: {
        GroupCompanyCode: string;
        GroupCompanyName: string;
        DefaultRmbCode: string;
      };
      private _app;
      private _currentConfigCompanyCode;
      private _serverPartition;
      private _customPartition;
      private _moduleName;
      private _formId;
      private _formName;
      private _formCaption;
      private _formWidth;
      private _formHeight;
      private _maxmizeBox;
      private _minimizeBox;
      private _resizable;
      private _initializeFlag;
      private _layoutIds?;
      private _dataSetName?;
      private _tableNames?;
      private _serviceName;
      private _initialConfiParas;
      private _configInfo;
      private _systemInfo;
      private _dropDownBindSource;
      private _dropDownCascader;
      private _gridOptions;
      private _gridOptionsRealTime;
      private _hiddenFields;
      private _requiredFields;
      private _requiredFieldsByCondition;
      private _formDataSet;
      private _formBindingRelation;
      private _formAuthButtons;
      private _groupCompanyCode;
      private _groupCompanyName;
      private _formConfigLincens;
      private _developPermisson;
      private _tempSingleConfigInfo;
      private _gridInstanceInfo;
      private _gridColumnsInfo;
      private _gridColumnsConfigInfo;
      private _gridStyleInfo;
      private _allowMergeColumnFields;
      private _widgetInstanceInfo;
      private _layoutConfigRelationInfo;
      private _layoutValidator;
      private _fieldsVisibleInfo;
      private _sysParaInfo;
      private _gridCustomEvent;
      private _layoutOpitons;
      private _layoutItemOpitons;
      /**
       * 画面工具类构造函数
       * @param serverPartition 服务分区
       * @param formName 画面代码
       * @param serviceName 服务名称
       */
      constructor(serverPartition?: string, formName?: string, serviceName?: string);
      /**
       * 调用后台服务service获取配置数据并实例化工具类
       * @param serverPartition 服务分区
       * @param formName 画面代码
       * @param layoutIds 区域配置代码
       * @param serviceName 初始化调用service
       * @param sysConfiParas 画面自定义参数
       * @returns Promise number 大于零表示实例化成功
       */
      Initialize(serverPartition?: string, formName?: string, layoutIds?: string | Array<string>, serviceName?: string, initialConfiParas?: {
        [key: string]: string | number;
      }): Promise<{
        flag: number;
        msg: string;
      }>;
      /**
       * 根据配置数据初始化工具类相关配置信息
       * @param data 配置信息
       */
      private InitializeWithData;
      /**
       * 动态追加获取相关配置信息
       * @param configId 配置Id
       * @param sysConfiParas 画面自定义参数
       * @returns Promise number 大于零表示实例化成功
       */
      loadConfig(configId: string, initialConfiParas?: {
        [key: string]: string | number;
      }): Promise<{
        flag: number;
        msg: string;
      }>;
      /**
       * 设置画面标题
       * @param caption 画面标题
       * @returns FormHelper
       */
      setFormCapiton(caption: string): FormHelper;
      /**
       * 设置下拉框绑定的数据源及必填项配置
       * @param viewConfig 配置信息
       */
      private setDropDownBindSourceAndRequiredFields;
      /**
       * 设置自定义业务分区
       * @param partition 分区
       */
      setCustomPartition(partition: string): string;
      /**
       * 设置Layout的显示标题
       * @param configId 配置Id
       * @param caption 显示标题
       */
      setLayoutCaption(configId: string, caption: string): void;
      /**
       * 设置Layout的显示标题
       * @param configId 配置Id
       * @param caption 显示标题
       */
      getLayoutCaption(configId: string): string;
      /**
       * 设置Layout绑定的Model
       * @param configId 配置Id
       * @param model Model
       */
      setLayoutBindModel(configId: string, model: Model): void;
      /**
       * 获取Layout绑定的Model
       * @param configId 配置Id
       * @returns Model
       */
      getLayoutBindModel(configId: string): Model | undefined;
      /**
       * 设置Layout绑定的Form表单
       * @param configId 配置Id
       * @param form Form
       */
      setLayoutBindForm(configId: string, form: any): void;
      /**
       * 设置Layout绑定的Form表单
       * @param configId 配置Id
       * @param form Form
       */
      getLayoutBindForm(configId: string): any;
      /**
       * 设置Layout的属性
       * @param configId 配置Id
       * @param attrName 属性名称
       * @param attrValue 属性值
       */
      setLayoutOptions(configId: string, attrName: string, attrValue: any): FormHelper;
      /**
       * 获取Layout绑定的属性
       * @param configId 配置Id
       * @param attrName 属性名称
       * @returns 属性值
       */
      getLayoutOptions(configId: string, attrName: string): any;
      /**
       * 设置LayoutItem的属性
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param attrName 属性名称
       * @param attrValue 属性值
       */
      setLayoutItemOption(configId: string, itemCode: string, attrName: string, attrValue: any): FormHelper;
      /**
       * 获取LayoutItem绑定的属性
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param attrName 属性名称
       * @returns 属性值
       */
      getLayoutItemOption(configId: string, itemCode: string, attrName: string): any;
      /**
       * 设置LayoutItem的标题的颜色
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param color 颜色
       */
      setLayoutItemCaptionForeColor(configId: string, itemCode: string | Array<string>, color: any): FormHelper;
      /**
       * 设置LayoutItem的标题的背景色
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param color 颜色
       */
      setLayoutItemCaptionBackColor(configId: string, itemCode: string | Array<string>, color: any): FormHelper;
      /**
       * 设置LayoutItem的组件内容的颜色
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param color 颜色
       */
      setLayoutItemContentForeColor(configId: string, itemCode: string | Array<string>, color: any): FormHelper;
      /**
       * 设置LayoutItem的组件内容的背景色
       * @param configId 区域配置代码
       * @param itemCode 配置项目代码
       * @param color 颜色
       */
      setLayoutItemContentBackColor(configId: string, itemCode: string | Array<string>, color: any): FormHelper;
      /**
      * 绑定grid的自定义事件
      * @param configId 配置Id
      * @param eventName 自定义事件名称
      * @param func 绑定的事件函数
      */
      bindGridCustomEvent(configId: string, eventName: 'cellButtonClick', func: Function): FormHelper;
      /**
      * 获取grid绑定的自定义事件
      * @param configId 配置Id
      * @param eventName 自定义事件名称
      * @returns 绑定的自定义事件
      */
      getGridCustomEvent(configId: string, eventName: 'cellButtonClick'): Function;
      /**
       * 根据账套代码获取账套名称
       * @param companyCode 账套代码
       * @returns 账套名称
       */
      getCompanyName(companyCode: string): string;
      /**
       * 为配置区域Clone表结构
       * @param orgTableName 原始表名或区域配置Id
       * @param cloneTableName 克隆的新表名
       * @param configId 区域配置ID
       * @returns FormHelper
       */
      cloneTableForLayoutOrGrid(orgTableName: string, cloneTableName: string, configId: string): FormHelper;
      /**
       * 画面配置中是否包含配置
       * @param configId 配置Id
       * @returns 是否包含
       */
      containsConfig(configId: string): boolean;
      /**
       * 画面配置中是否不包含配置或者配置明细为空
       * @param configId 配置Id
       * @returns 是否包含
       */
      isEmptyConfig(configId: string): boolean;
      /**
       * 获取画面配置中的特定区域所有配置信息
       * @param configId 配置Id
       * @param onlyVisible 仅可见控件配置
       * @returns 配置信息
       */
      getConfigInfo(configId: string, onlyVisible?: boolean): {
        [key: string]: any;
      };
      /**
       * 获取画面配置中的特定区域主项配置信息
       * @param configId 配置Id
       * @returns 配置信息
       */
      getSingleViewConfigInfo(configId: string): any;
      /**
       * 获取区域内单个数据项的配置信息
       * @param configId 配置Id
       * @param itemCode 配置项目代码
       * @param configCompanyCode 配置账套[通常情况下为空]
       * @returns 配置信息
       */
      getSingleItemConfigInfo(configId: string, itemCode: string, configCompanyCode?: string): any;
      /**
       * 获取配置区域内所有字段配置数组
       * @param configId 配置Id
       * @returns itemCode数组
       */
      getAllItemCodeArray(configId: string): string[];
      /**
       * 获取相关的配置id数组
       * @returns configId数组
       */
      getAllConfigIdArray(): string[];
      /**
       * 设置单个配置项目的下来框配置信息
       * @param layoutType 配置类型
       * @param columnConfig 配置项目
       * @param dataSource 数据源[omitted时为配置数据源]
       * @returns 配置信息
       */
      setDropDownBindArribute(layoutType: string, columnConfig: any, dataSource?: any[]): {
        [key: string]: any;
      };
      /**
       * 设置下拉框及联筛选
       * @param configId 区域配置代码
       * @param itemCode 项目配置代码
       * @param value 相关值
       */
      filterDropDownCascaderDataSource(dataSource: any, filter: string, value: string): any;
      /**
       * 设置下拉框及联配置
       * @param configId 区域配置代码
       * @param itemCode 项目配置代码
       * @param value 相关值
       */
      setDropDownCascaderDataSource(configId: string, itemCode: string, value: any): void;
      /**
       * 获取下拉框及联数据源
       * @param configId 区域配置代码
       * @param itemCode 项目配置代码
       * @param parentConfigId 及联区域配置代码
       * @param parentItemCode 及联项目配置代码
       */
      getDropDownCascaderDataTable(configId: string, itemCode: string, parentConfigId: string, parentItemCode: string): any;
      /**
       * 获取Grid的配置样式
       * @param configId 配置代码
       * @return 配置样式
       */
      getGridStyleConfig(configId: string): any;
      /**
       * 设置下拉框自动填充
       * @param configId 区域配置代码
       * @param itemCode 项目配置代码
       * @param value 相关值
       */
      setDropDownAutoFillFieldForLayout(configId: string, itemCode: string, value: any): void;
      /**
     * 设置Grid下拉框自动填充
     * @param configId 区域配置代码
     * @param itemCode 项目配置代码
     * @param model 对应的Model对象
     */
      setDropDownAutoFillFieldsForGrid(grid: string, itemCode: string, model: any, multiRowsEdit?: boolean): void;
      /**
       * 向已有配置下拉数据源中添加代码
       * @param codeClass 代码配置
       * @param itemCodes 添加的代码数组
       * @param type 添加类型[push:添加到最后;unshift:添加到最前]
       */
      addDropDownCode(codeClass: string, itemCodes: {}[], type: 'push' | 'unshift'): void;
      /**
       * 重新载入下拉框的选项数据源
       * @param configId 区域配置代码
       * @param itemCode 项目配置代码
       * @param dataSource 重新载入的数据源[json数组或EiBlock]
       */
      reloadDropDownDataSource(configId: string, itemCode: string, dataSource?: any): Promise<void>;
      /**
       * 根据画面相关配置生成数据集
       * @returns DataTableSet
       */
      private createDataSet;
      /**
       * 根据画面相关配置生成数据表DataTable
       * @param tableName 表名
       * @returns DataTable
       */
      createDataTable(tableName: string): any;
      /**
       * 根据dataTable获取对应的表名
       * @param dataTable dataTable
       * @returns dataTable
       */
      getTableName(dataTable: DataTable): any;
      /**
       * 获取布局绑定的DataTable名称[表名]
       * @param configId 配置代码
       * @returns DataTable
       */
      getBindingTableName(configId: string): string;
      /**
       * 设置布局绑定的DataTable名称[表名]
       * @param configId 配置代码
       * @returns DataTable
       */
      setBindingTableName(configId: string): string;
      /**
       * 根据布局配置获取关联绑定的数据表DataTable
       * @param configId 配置代码
       * @returns DataTable
       */
      getBindingTable(configId: string): any;
      /**
       * 根据布局配置获取关联绑定的数据表DataTable并转换成EI.EiBlock
       * @param configId 配置代码
       * @returns DataTable
       */
      getBindingTableAsBlock(configId: string): EI.EiBlock;
      /**
       * 获取布局绑定相关的数据表DataTable是否有变动
       * @param configIds 配置代码数组
       * @returns boolean 是否变动
       */
      hasDataChange(...configIds: string[]): boolean;
      /**
       * 撤销grid的数据操作
       * @param grid grid实例或者grid的配置代码
       * @returns FormHelper
       */
      cancelGridChange(grid: any): FormHelper;
      /**
       * 将数据绑定到画面相关布局中
       * @param data 数据
       * @param clearExistData 清除已有数据
       * @param configIds 布局数组
       * @returns this
       */
      mergeDataToLayoutOrGrid(data: EI.EIInfo | EI.EiBlock | Array<{
        [key: string]: any;
      }>, clearExistData?: boolean, ...configIds: string[]): FormHelper;
      /**
       * 校验画面是否有数据变动,并弹出提示框确定是否继续
       * @param configIds 配置代码数组
       * @returns boolean 是否继续
       */
      checkFormChanged(...configIds: string[]): Promise<boolean>;
      /**
       * 根据布局配置向Grid增加一行
       * @param configId 配置代码
       * @param setDefaultValue 是否设置默认值
       * @param insertAtTop 是否新增行在顶部(可接受的选项[true, false, 'default', 'afterCurrent', 'beforeCurrent'])
       * @returns boolean 是否变动
       */
      addRowToGrid(configId: string, setDefaultValue?: boolean, insertAtTop?: any, autoCheckRow?: boolean): any;
      /**
       * 根据布局配置向Grid复制增加一行
       * @param configId 配置代码
       * @param autoCheckRow 是否自动勾选
       * @returns any
       */
      addCopyRowToGrid(configId: string, insertAtTop?: any, autoCheckRow?: boolean): any;
      /**
       * 根据布局配置向Grid导入数据
       * @param configId 配置代码
       * @param data 要导入的数据
       * @param autoCheckRow 是否自动勾选新增行
       * @returns void
       */
      importRowsToGrid(configId: string, data: any[], autoCheckRow?: boolean): void;
      /**
       * 根据布局配置获取Grid的aggregates信息
       * @param configId 配置代码
       * @returns Grid的aggregates信息
       */
      getGridAggregates(grid: any): any;
      /**
       * 根据配置代码获取绑定相关DataTable指定uid的单个对象[未传入uid时返回第一个对象]
       * @param configId 区域配置代码
       * @param uid uid
       * @returns ObservDataObject
       */
      getModelFromGridOrLayout(configId: string, uid?: string, toJson?: boolean, extendJsonData?: {
        [key: string]: any;
      }): any;
      /**
       * 根据配置代码获取绑定相关DataTable指定uid的单个对象[未传入uid时返回第一个对象]
       * @param configId 区域配置代码
       * @param uid uid
       * @returns ObservDataObject
       */
      getModelFromGridOrLayoutAsBlock(configId: string, uid?: string, extendJsonData?: {
        [key: string]: any;
      }): EI.EiBlock;
      /**
       * 获取DataTable指定uid的单个对象[未传入uid时返回第一个对象]
       * @param dataTable 区域配置代码或DataTable对象
       * @param uid uid
       * @returns ObservDataObject
       */
      getModelFromDataTable(dataTable: DataTable | string, uid?: string, toJson?: boolean, extendJsonData?: {
        [key: string]: any;
      }): any;
      /**
       * 获取Grid关联的DataSource的总行数
       * @param dataSource 区域配置代码或DataSource对象
       * @param uid uid
       * @returns ObservDataObject
       */
      getGridDataCount(grid: any): any;
      /**
       * 获取DataTable指定id的单个对象
       * @param dataTable 区域配置代码或DataTable对象
       * @param id id
       * @returns ObservDataObject
       */
      getModelFromDataTableById(dataTable: any, id: string, toJson?: boolean): any;
      /**
       * 将kendo.data.ObservableObject或ER.Model转换成EiBlock
       * @param dataModel 区域配置代码或DataTable对象
       * @param extendJsonData 扩展的属性
       * @returns EiBlock
       */
      convertModelAsBlock(dataModel: ER.Model, extendJsonData?: {
        [key: string]: any;
      }): EI.EiBlock;
      /**
       * 向单记录配置区域增加一条初始记录
       * @param configIds 配置区域
       * @param setDefaultValue 是否赋配置默认值
       * @param setReadOnly 设置只读
       * @returns Model
       */
      addModelToLayout(configIds: string | Array<string>, setDefaultValue?: boolean, setReadOnly?: boolean | 'default'): any;
      /**
       * 获取DataTable中指定索引的数据转换成Json,并以此创建一个EiBlock
       * @param dataTable dataTable或布局配置代码
       * @param index 索引，默认0
       * @param operateTypeColumnName 自定义键名[根据键名自动增加一个键]
       * @param opreateTypeCode 自定义键对应的值
       * @returns EiBlock
       */
      getDataFromDataTableAsEiBlock(dataTable: DataTable | string, index?: number, operateTypeColumnName?: string, opreateTypeCode?: string): EI.EiBlock;
      /**
       * 数据类型转换，根据datasource schema进行强类型弱类型互相转换
       * @param data 数据
       * @param dataTable DataTable
       * @param type 转换类型
       * @returns data
       */
      convertDataType(data: EI.EiBlock | any[], dataTable: DataTable, type: 'strongly' | 'weakly'): any;
      /**
       * 获取DataTable的SchemaModelFields
       * @param dataTable dataTable
       * @returns DataTableSchemaModelFields
       */
      getModelFields(dataTable: DataTable): DataTableSchemaFields;
      /**
       * 根据配置控件类型转换成对应的组件名称
       * @param configContrlType dataTable或布局配置代码
       * @param dateFormat 日期格式化[区分日期控件和时间控件]
       * @returns 组件名称
       */
      getControlName(contrlType: string, dateFormat: string): string;
      /**
       * 设置并获取单记录区域的输入验证组件kendoValidator
       * @param configId 区域配置代码
       * @returns kendo.ui.Validator
       */
      getValidator(configId: string): any;
      private getkendoWidgetProps;
      /**
      * 重置validator提示信息
      * @param configIds 配置区域代码[支持数组，逗号隔开的字符串，未传入或传入为空时，验证画面上所有布局]
      * @returns void
      */
      resetValidator(configIds?: string | Array<string>): void;
      /**
       * 获取Layout区域的Label(span元素)
       * @param configId 配置区域ID
       * @param itemCode 配置字段代码
       * @returns span jquery element
       */
      getLayoutLabelSpan(configId: string, itemCode: string): any;
      /**
       * 根据页面布局配置代码获取对象JQuery元素
       * @param configId 配置代码
       * @param itemCode 项目代码
       * @returns JQuery元素
       */
      getLayoutJqueryElement(configId: string, itemCode: string): any;
      /**
       * Grid自适应列宽
       * @param grid grid配置代码或者KendoGrid对象
       * @returns FormHelper
       */
      autoBestFit(grid: any): FormHelper;
      /**
       * 根据配置代码获取Grid对象
       * @param configId 配置代码
       * @returns Grid对象
       */
      getGrid(grid: any): any;
      /**
       * 获取Grid对象的Api
       * @param grid grid对象或配置代码
       * @returns Grid对象
       */
      getGridApi(grid: any): GridApi | undefined;
      /**
       * 获取Grid对象的ColumnApi
       * @param grid grid对象或配置代码
       * @returns Grid对象
       */
      getGridColumnApi(grid: any): ColumnApi | undefined;
      /**
       * 获取grid的低代码配置
       * @param configId 配置代码
       * @returns grid的低代码配置
       */
      getGridConfig(grid: any): any;
      /**
       * 根据配置代码及列名获取GridColumn
       * @param grid 配置代码或Grid对象
       * @param fieldName 配置的列名
       * @returns GridColumn
       */
      getGridColumn(grid: any, itemCode: string): any;
      /**
       * 显示Grid的列
       * @param grid 配置代码或grid对象
       * @param column 列信息
       * @returns this
       */
      showGridColumn(grid: any, column: string | Array<string>): FormHelper;
      /**
       * 隐藏Grid的列
       * @param grid 配置代码或grid对象
       * @param column 列信息
       * @returns this
       */
      hideGridColumn(grid: any, column: string | Array<string>): FormHelper;
      /**
       * 显示Grid的选择列
       * @param grid 配置代码或grid对象
       * @returns this
       */
      showGridCheckColumn(grid: any): FormHelper;
      /**
       * 隐藏Grid的选择列
       * @param grid 配置代码或grid对象
       * @returns this
       */
      hideGridCheckColumn(grid: any): FormHelper;
      /**
       * 显示或隐藏Grid的选择列
       * @param grid 配置代码或grid对象
       * @param showOrHide 显示或隐藏
       * @returns this
       */
      showOrHideGridCheckColumn(grid: any, showOrHide?: 'show' | 'hide' | 'default'): FormHelper;
      /**
       * 设置Grid是否允许拖拽行
       * @param grid 配置代码或grid对象
       * @param allowDrag 是否允许拖拽行
       * @returns this
       */
      setGridRowDrag(grid: any, allowDrag?: true | false | 'default'): FormHelper;
      /**
       * 增加Grid的列
       * @param grid 配置代码或grid对象
       * @param column 列信息
       * @returns this
       */
      addGridColumn(grid: any, column: {} | Array<{}>): FormHelper;
      /**
       * 删除Grid的列
       * @param grid 配置代码或grid对象
       * @param colId 列信息
       * @returns this
       */
      removeGridColumn(grid: any, colId: string | Array<string>): FormHelper;
      /**
       * 设置Grid的Enable
       * @param grid 配置代码或grid对象
       * @param enabled 是否可用
       * @returns this
       */
      setGridEnable(grid: any, enabled?: boolean): FormHelper;
      /**
       * 设置Grid是否可编辑
       * @param grid Grid对象或配置代码
       * @param editable 是否可编辑
       * @returns this
       */
      setGridEditable(grid: any, editable: boolean): FormHelper;
      /**
       * 重新将Grid焦点定位到指定行
       * @param grid 配置代码或grid对象
       * @param keyfilter 需要定位的行数据的条件
       * @returns this
       */
      setGridIndicator(grid: any, keyfilter: {
        [key: string]: any;
      }): FormHelper;
      /**
      * 设置画面的Grid实例信息
      * @param configId 配置代码
      * @param grid grid实例
      * @returns this
      */
      setGridInstanceInfo(configId: string, instance: any): FormHelper;
      /**
      * 刷新grid的合计行信息
      * @param grid grid实例或配置代码
      * @returns this
      */
      refreshGridFooterData(grid: any): FormHelper;
      /**
      * 设置画面的Layout与配置Id的关系信息
      * @param configId 配置代码
      * @param layoutName layoutName
      * @returns this
      */
      setLayoutConfigRelationInfo(configId: string, layoutName: string): FormHelper;
      /**
      * 根据LayoutName获取配置Id
      * @param layoutName layoutName
      * @returns 配置Id
      */
      getConfigIdbyLayoutName(layoutName: string): string;
      /**
      * 根据Grid对象获取配置Id
      * @param grid grid
      * @returns 配置Id
      */
      getGridConfigId(grid: any): string;
      /**
      * 设置画面的单记录的控件实例信息
      * @param configId 配置代码
      * @param itemCode 控件配置代码
      * @param widget 控件信息
      * @returns this
      */
      setWidgetInstanceInfo(configId: string, itemCode: string, widget: any): FormHelper;
      /**
      * 设置Layout中配置的控件是否可见
      * @param configId 配置代码
      * @param visible 是否可见
      * @param itemCodes 控件配置代码[多个项目用逗号隔开]
      * @param resetValue 控件的值重置类型[none:不操作|defalut:设置成配置默认值|empty:清空值]
      * @returns this
      */
      setControlVisible(configId: string, visible: boolean, itemCodes: string, resetValue?: 'none' | 'defalut' | 'empty'): FormHelper;
      /**
       * 设置KendoGrid列的标题
       * @param grid grid对象
       * @param itemCode 列配置的字段名[多个字段用半角逗号隔开]
       * @param title 设置的列标题[多个字段用半角逗号隔开]
       * @returns void
       */
      setGridColumnTitle(grid: any, titleInfoSet: {
        colId: string;
        title: string;
      }[]): FormHelper;
      /**
       * 设置Grid的运行时属性
       * @param configId 配置代码
       * @param key 属性代码
       * @param value 属性值
       * @returns this
       */
      setGridOptions(configId: string, key: string, value: any): FormHelper;
      /**
       * 获取Grid的运行时属性
       * @param configId 配置代码
       * @param key 属性代码
       * @returns 属性值
       */
      getGridOptions(configId: string, key: string): any;
      /**
       * 获取KendoGrid的editable属性
       * @param configId 配置代码
       * @returns this
       */
      getGridEditable(configId: string): boolean;
      /**
       * 根据配置代码获取组件
       * @param configId Grid配置Id
       * @param itemCode 字段配置代码
       * @param widgetType 组件类型
       * @returns 组件
       */
      getControl(configId: string, itemCode: string, widgetType?: string): any;
      /**
       * 低代码配置控件的值是否为空
       * @param configId Grid配置Id
       * @param itemCodes 字段配置代码[多个字段时用逗号隔开]
       * @param widgetType 组件类型
       * @returns 是否为空
       */
      isControlEmptyValue(configId: string, itemCodes: string, widgetType?: string): boolean;
      /**
       * 设置组件的条件属性
       * @param configId 配置区域代码
       * @param behaviorName 操作定义类型
       * @param propName 设置的属性名称[默认为ReadOnly]
       * @param propValue 设置的属性值[默认为true]
       * @param exceptItemCodes 排除的项目[可为空]
       * @returns this
       */
      setControlConditionProps(configId: string, behaviorName: string, propName?: string, propValue?: boolean | string, exceptItemCodes?: Array<string>): FormHelper;
      /**
       * 根据配置代码获取ErLayout组件项的值
       * @param configId 配置Id
       * @param itemCodes 字段配置代码[多个字段时用逗号隔开]
       * @returns 组件项的值
       */
      getControlValue(configId: string, itemCodes: string): any;
      /**
       * 根据配置代码获取Kendo组件的显示文本[等同getControlText]
       * @param configId Grid配置Id
       * @param itemCode 字段配置代码
       * @param widgetType 组件类型
       * @returns Kendo组件的显示文本
       */
      getControlText(configId: string, itemCodes: string, widgetType?: string): string;
      /**
       * 根据配置代码设置ErLayout组件的值
       * @param configId Grid配置Id
       * @param itemCode 字段配置代码
       * @param editValue 需要设置的值
       * @param widgetType 组件类型
       * @returns this
       */
      setControlValue(configId: string, itemCode: string, editValue: any): FormHelper;
      /**
       * 根据配置代码设置ErLayout组件的值
       * @param configId 配置Id
       * @param editValue 需要设置的值
       * @param itemCodes 配置代码
       * @returns this
       */
      setControlValueEx(configId: string, values: any, ...itemCodes: string[]): FormHelper;
      /**
       * 根据配置代码设置ErLayout组件的样式
       * @param configId 配置Id
       * @param itemCodes 配置代码
       * @param cssInfo css信息
       * @returns this
       */
      setControlCss(configId: string, itemCodes: string | Array<string>, cssInfo: {
        property: string;
        value: any;
      }[]): FormHelper;
      /**
       * 根据配置代码设置Kendo组件的值
       * @param configId Grid配置Id
       * @param editValue 需要设置的值
       * @param itemCodes 配置代码
       * @returns this
       */
      setModelDefalutValue(dataModel: ER.Model, configId: string | Array<string>, itemCode?: string, reserveValue?: any): FormHelper;
      /**
       * 设置Kendo Model的值
       * @param dataModel Model
       * @param values 需要设置的值[单个值或Json]
       * @param itemCodes 需要设置的字段
       * @returns this
       */
      setModelValue(model: Model, values: any, ...itemCodes: string[]): FormHelper;
      /**
       * 设置Kendo Model的属性值为空
       * @param dataModel Model
       * @param values 需要设置的值[单个值或Json]
       * @param itemCodes 需要设置的字段
       * @returns this
       */
      setModelEmptyValue(dataModel: ER.Model, ...itemCodes: any[]): FormHelper;
      /**
       * 设置组件只读
       * @param configId 配置区域代码
       * @param readonly 字段只读信息
       * @returns this
       */
      setControlReadOnlyEx(configId: string, readonly: {
        [key: string]: boolean | 'default';
      } | undefined): FormHelper;
      /**
       * 设置ErLayout组件只读
       * @param configId 配置区域代码
       * @param readonly 是否只读或默认
       * @param itemCodes 需要设置的字段
       * @returns this
       */
      setControlReadOnly(configId: string, readOnly: boolean | 'default', ...itemCodes: string[]): FormHelper;
      /**
       * 设置ErLayout区域内所有组件只读属性
       * @param configId 配置区域代码或配置代码数组[支持逗号隔开的字符串]
       * @param readonly 是否只读或默认
       * @returns this
       */
      setAllControlReadOnly(configId: string | Array<string>, readOnly: boolean | 'default'): FormHelper;
      /**
       * 设置ErLayout组件enable属性
       * @param configId 配置区域代码或配置代码数组[支持逗号隔开的字符串]
       * @param enable 是否可用
       * @returns this
       */
      setControlEnable(configId: string, enable: boolean | 'default', ...itemCodes: string[]): FormHelper;
      /**
       * 设置ErLayout区域内所有组件是否可编辑
       * @param configId 配置区域代码或配置代码数组[支持逗号隔开的字符串]
       * @param enable 是否可编辑
       * @returns this
       */
      setAllControlEnable(configId: string | Array<string>, enable: boolean | 'default'): FormHelper;
      /**
       * 设置ErLayout区域内组件值为空
       * @param configId 配置区域代码
       * @param itemCodes 字段数组，不传入改参数时区域内所有
       * @returns this
       */
      setControlEmptyValue(configId: string, ...itemCodes: string[]): FormHelper;
      /**
       * 设置ErLayout组件内的控件的默认值
       * @param configId 配置区域代码或代码集合
       * @param ignoreExistValue 已存在值时是否忽略
       * @returns this
       */
      setAllControlDefalutValue(configId: string | Array<string>, ignoreExistValue?: boolean): FormHelper;
      /**
       * 设置ErLayout区域内控件的默认值
       * @param configId 配置区域代码
       * @param itemCodes 配置控件代码
       * @param ignoreExistValue 已存在值时是否忽略
       * @returns this
       */
      setControlDefalutValue(configId: string, itemCode: string, ignoreExistValue?: boolean): FormHelper;
      /**
       * 获取画面配置按钮信息
       * @param buttonName 按钮代码
       * @returns 配置信息
       */
      getFormButtonConfigInfo(buttonName: string): any;
      /**
       * 重置配置区域内所有控件的值
       * @param configId 配置区域代码
       * @returns this
       */
      resetLayout(configId: string | Array<string>): FormHelper;
      /**
       * 获取配置区域内所有控件的值
       * @param configId 配置区域代码或用逗号隔开的多个配置代码或配置代码数组
       * @param extendJson 扩展属性
       * @returns Json
       */
      getAllControlValue(configId: string | Array<string>, extendJson?: {
        [key: string]: any;
      }): {
        [key: string]: any;
      };
      /**
       * 获取配置区域内所有控件的值，并以此生成EiBlock
       * @param configId 配置区域代码
       * @param extendJson 扩展属性
       * @returns EiBlock
       */
      getAllControlValueAsEiBlock(configId: string | Array<string>, extendJson?: {
        [key: string]: any;
      }): EI.EiBlock;
      /**
       * 获取配置区域内所有控件的值，并以此生成查询条件的结构[后台服务需支持]
       * @param configId 配置区域代码
       * @param extendJson 扩展属性
       * @returns EiBlock
       */
      getAllControlValueAsFilter(configId: string | Array<string>, extendJson?: {
        [key: string]: any;
      }): EI.EiBlock;
      /**
      * 展开LayoutGroup区域
      * @param configIds 配置区域代码
      * @returns EiBlock
      */
      expandLayoutGroup(configIds: string | Array<string>): FormHelper;
      /**
      * 收起LayoutGroup区域
      * @param configIds 配置区域代码
      * @returns EiBlock
      */
      collapseLayoutGroup(configIds: string | Array<string>): FormHelper;
      /**
       * 添加自定义查询条件配置[后台服务需支持]
       * @param customFilter 查询条件脚本
       * @param queryFilterBlock 查询条件配置
       * @returns EiBlock
       */
      addCustomFilterToQueryFilter(customFilter: string, queryFilterBlock: EI.EiBlock): FormHelper;
      /**
       * 根据画面配置按钮的服务查询数据
       * @param buttonName 按钮名称
       * @param filterConfigId 查询条件区域配置代码
       * @param customFilterString 附加用户自定义条件
       * @returns Promise<EI.EIInfo>
       */
      queryDataByButton(buttonName: string, filterConfigId: string, customFilterString?: string, customFilterJson?: {
        [key: string]: any;
      }): Promise<EI.EIInfo>;
      /**
       * 根据service查询数据
       * @param serviceName 服务名称
       * @param paras 附加参数
       * @returns Promise<EI.EIInfo>
       */
      queryDataByService(serviceName: string, paras?: {
        filterConfigId?: string;
        queryType?: {
          [key: string]: any;
        };
        customFilter?: string;
        dataTable?: string | DataTable;
        clearTable?: true;
      }): Promise<EI.EIInfo>;
      /**
     * 根据DataSource查询数据[当传入grid的配置ID时会根据配置获取数据查询并绑定到Grid]
     * @param DataSourceId 数据源ID或Grid的配置ID
     * @param paras 附加参数
     * @returns Promise<EI.EIInfo>
     */
      queryDataByDataSource(dataSourceId: string, paras?: {
        filterConfigId?: string;
        queryType?: {
          [key: string]: any;
        };
        customFilter?: string;
        dataTable?: string | DataTable;
        clearTable?: true;
      }, serviceName?: string): Promise<EI.EIInfo>;
      /**
       * 获取画面配置代码对应的SQL条件脚本
       * @param codeClass 代码定义
       * @param code 代码值
       * @returns SQL条件脚本
       */
      getFormCodeSetFilter(codeClass: string, code: string): string;
      /**
       * 获取格式化后的SQL脚本，自动替换系统预置的占位符
       * @param sqlScript SQL脚本
       * @param companyCode 账套代码
       * @returns 格式化后SQL脚本
       */
      getQuerySqlFormat(sqlScript: string, companyCode?: string): string;
      /**
       * 获取系统配置参数
       * @param sysInfoName 参数名称
       * @returns 参数值
       */
      getFormSysInfo(sysInfoName: string): string;
      /**
       * 获取系统配置参数
       * @param companyCode 账套代码
       * @param sysParaCode 参数代码
       * @param effectValue 影响因素值
       * @returns 参数值
       */
      getSysParaValue(companyCode: string, sysParaCode: string, effectValue?: string): Promise<string>;
      /**
       * 格式化系统配置的默认值
       * @param defaultValue 默认值
       * @returns 格式化后的默认值
       */
      getDefaultStringValue(defaultValue: string): string;
      /**
       * 获取Layout区域配置的默认值
       * @param configIds 配置代码
       * @returns 格式化后的默认值
       */
      getLayoutConfigDefaultValues(configIds: string | Array<string>): {
        [key: string]: any;
      };
      /**
       * 获取Grid区域配置的默认值
       * @param configId 配置代码
       * @returns 格式化后的默认值
       */
      getGridConfigDefaultValues(configId: string): {
        [key: string]: any;
      };
      /**
       * 根据配置设置Grid的Options
       * @param configId 配置代码
       * @param gridOptions 传入已有的Options
       * @returns Options
       */
      loadGrid(configId: string, gridInstance: any, options?: any, toolbarOptions?: any, pageOptions?: any): any;
      /**
      * 获取grid列头自定义模版
      * @param header 列头配置信息
      * @returns 列头模版
      */
      private getGridHeaderTemplate;
      /**
      * 获取grid分组显示时的分组名称
      * @param rowNode 分组结点
      * @param parentIndex 父分组名称
      * @returns 分组名称
      */
      private getGroupIndexName;
      /**
      * 执行Grid列配置的计算公式
      * @param data 相关行数据
      * @param expression 表达式
      * @returns result
      */
      private excuteGridColumnExpressions;
      /**
       * 根据配置生成BandColumn信息
       * @param bandConfigInfo GridBand配置信息
       * @param bandColumns 所有Band
       * @param finalBandColumns 叶子结点Band
       * @param fatherBand 父级Band
       * @param options grid组件传入的options
       * @returns BandColumn
       */
      private createGridBandColumn;
      /**
       * 设置Grid的列下拉框绑定相关属性
       * @param configId Grid配置代码
       * @param colDef GridColumn
       * @param dropDownDataSource 绑定数据源
       * @param valueField 绑定值列
       * @param textField 绑定显示列
       * @param valueVisible 是否显示值
       * @returns this
       */
      private setGridColumnDropdown;
      /**
       * 设置Grid的列头菜单信息
       * @param configId Grid配置代码
       * @param gridInstance grid实例
       * @param options grid组件传入的options
       * @returns FormHelper
       */
      private setGridMainMenuItems;
      /**
       * 设置Grid的行样式信息
       * @param configId Grid配置代码
       * @param gridInstance grid实例
       * @param options grid组件传入的options
       * @returns FormHelper
       */
      private setGridRowStyle;
      /**
       * 设置Grid的列是否可编辑
       * @param grid Grid对象或配置代码
       * @param editable 是否可编辑
       * @param ...colIds 列信息
       * @returns this
       */
      setGridColumnEditable(grid: any, editable: boolean | 'default', ...colIds: string[]): FormHelper;
      /**
       * 根据配置信息及选中代码获取选中行的数据
       * @param configId 布局配置代码
       * @param itemCode 字段配置代码
       * @param selectValue 选中值[未传入时取当前控件值|ErGrid组件中使用时,必须传入该值]
       * @returns 选中行数据
       */
      getDropDownSelectedData(configId: string, itemCode: string, selectValue?: any): {};
      /**
       * 根据配置信息及选中代码获取对应的中文名称
       * @param configId 布局配置代码
       * @param itemCode 字段配置代码
       * @param selectValue 选中值[未传入时取当前控件值]
       * @returns 中文名称
       */
      getDropDownSelectedText(configId: string, itemCode: string, selectValue?: any): string;
      /**
       * 根据配置信息及选中代码获取对应的中文名称
       * @param configId 布局配置代码
       * @param itemCode 字段配置代码
       * @param selectValue 选中值
       * @returns 中文名称
       */
      getDropDownMultiSelectedText(configId: string, itemCode: string, selectValue: string): string;
      /**
       * 同步Grid列顺序
       * @param configId 布局配置代码
       * @returns
       */
      uploadGridColumnSeq(configId: string): Promise<unknown>;
      /**
       * 同步Grid列属性
       * @param configId 布局配置代码
       * @param columnName 列配置代码
       * @param propName 属性名称
       * @param propValue 属性值
       * @returns
       */
      uploadGridColumnProps(configId: string, columnName: string, propName: string, propValue: any): Promise<unknown>;
      /**
       * 同步Grid列属性
       * @param columnConfigs 属性配置信息
       * @returns
       */
      uploadGridColumnPropsEx(columnConfigs: {
        COMPANY_CODE: string;
        FORM_NAME: string;
        FUNCTION_ID: string;
        ITEM_CODE: string;
        PROPERTY_NAME: string;
        PROPERTY_VALUE: any;
      }[]): Promise<unknown>;
      /**
       * 同步Grid属性
       * @param configId 布局配置代码
       * @param propName 属性名称
       * @param propValue 属性值
       * @returns
       */
      uploadGridViewProps(configId: string, propName: string, propValue: any): Promise<unknown>;
      /**
       * 同步Grid属性
       * @param viewConfigs 属性配置信息
       * @returns
       */
      uploadGridViewPropsEx(viewConfigs: {
        COMPANY_CODE: string;
        FORM_NAME: string;
        FUNCTION_ID: string;
        PROPERTY_NAME: string;
        PROPERTY_VALUE: any;
      }[]): Promise<unknown>;
      /**
       * 同步Grid列宽属性
       * @param configId 布局配置代码
       * @param fieldName 列配置代码[未传入时表示所有列]
       * @returns
       */
      uploadGridColumnWidth(configId: string, itemCode?: string): Promise<unknown>;
      /**
       * 同步Grid个人配置信息
       * @param configId 布局配置代码
       * @returns
       */
      uploadGridColumnCustomConfig(configId: string): Promise<unknown>;
      /**
       * 重置Grid个人配置信息
       * @param configId 布局配置代码
       * @param userId 用户代码[未传入时表示所有用户]
       * @returns
       */
      deleteGridColumnCustomConfig(configId: string, userId?: string): Promise<unknown>;
      /**
       * 验证必填项、输入校验及条件必填项
       * @param configIds 配置区域代码[支持数组，逗号隔开的字符串，未传入或传入为空时，验证画面上所有布局]
       * @returns 验证通过返回true，否则返回false
       */
      checkRequiredInput(configIds?: string | Array<string>, showMessage?: boolean): Promise<boolean>;
      /**
       * 验证Grid的必填项
       * @param grid grid对象或grid配置代码
       * @param checkRowType 验证类型
       * @param checkVisibleColumns 是否只验证可见列
       * @param showMessage 是否显示提示信息
       * @returns 验证通过返回true，否则返回false
       */
      checkGridInput(grid: string, checkRowType?: 'ChangedRows' | 'CheckedRows' | 'AllRows', checkVisibleColumns?: boolean, showMessage?: boolean): boolean;
      private checkGridRowInput;
      /**
       * 勾选指定的grid行[必须有勾选框的情况下]
       * @param grid any
       * @param rowData any[uid字符串,或者包含uid属性的对象以及对象数组]
       * @returns FormHelper
       */
      checkGridRow(grid: any, rowData: any, setChecked?: boolean): FormHelper;
      /**
      * 勾选grid的当前行[必须有勾选框的情况下]
      * @param grid kendo.ui.Grid
      * @returns Grid实例
      */
      checkGridCurrentRow(grid: any): void;
      /**
       * 勾选所有的grid行[必须有勾选框的情况下]
       * @param grid grid
       * @param afterFilter 是否筛选排序以后的行[默认true]
       * @returns void
       */
      checkAllGridRow(grid: any, afterFilterAndSort?: boolean): void;
      /**
       * 取消勾选所有的grid行[必须有勾选框的情况下]
       * @param grid grid
       * @param afterFilter 是否筛选排序以后的行[默认true]
       * @returns void
       */
      unCheckAllGridRow(grid: any, afterFilterAndSort?: boolean): void;
      /**
      * 判断Grid的行是否被勾选中[必须有勾选框的情况下]
      * @param grid Grid
      * @param rowData Modelt 或行数据的uid
      * @returns Grid实例
      */
      isGridRowChecked(grid: any, rowData: Model | string): boolean | undefined;
      /**
       * 设置localStorage
       * @param key 键
       * @param value 值
       * @returns Storage
       */
      setLocalStorage(key: string, value: {
        [key: string]: any;
      }): Storage;
      /**
       * 获取localStorage
       * @param key 键
       * @param removeAfterGet 获取值后删除相应的key
       * @returns string
       */
      getLocalStorage(key: string, removeAfterGet?: boolean): string;
      /**
       * 获取画面传递参数
       * @param formName 画面名
       * @param removeAfterGet 获取值后删除相应的参数缓存
       * @returns any
       */
      getCallFormParas(formName: string, removeAfterGet?: boolean): any;
      /**
     * 复制文本到粘贴板
     * @param text 文本
     * @returns Promise<void>
     */
      copyText(text: string): Promise<unknown>;
      /**
       * 读取粘贴板的文本
       * @returns Promise<string>
       */
      readClipboardText(): Promise<string>;
      /**
       * 获取文本的长度
       * @param text 文本
       * @returns 长度
       */
      getTextWidth(text: string): number;
      /**
       * 获取Guid String === uuidv4()
       * @returns GUID String
       */
      getGuid(): string;
      /**
       * 四舍五入数值
       * @param num 原数值
       * @returns 四舍五入后的新数值
       */
      round(num: number, decimals: number): number;
      /**
       * 在元素区域上显示loading，element参数为空时，覆盖整个页面区域
       * @param toggle （true：显示loading， false：关闭loading）
       * @param element 元素
       */
      loading(toggle: boolean, element?: JQuery<HTMLElement>): void;
      /**
       * 根据传入的数组变量替换对应位置占位符{n}后的字符串
       * @param orginalString
       * @param args 替换占位符{n}的数组
       * @returns newString
       */
      stringFormat(orginalString: string, ...args: any[]): string;
      /**
       * 判断对象是否为空,字符串Trim()后lenght为零,数组长度为0时
       * @param obj
       * @returns boolean
       */
      isNullOrEmpty(obj: any): boolean;
      /**
       * 校验对象是否为空，同时当[nullWarningMsg]参数不为空时提示警告信息
       * @param obj
       * @param nullWarningMsg 为空时提示警告信息
       * @returns boolean
       */
      checkNullOrEmpty(obj: any, nullWarningMsg?: string): boolean;
      /**
       *  调用后台服务
       * @param svcName 服务名称
       * @param data 传入EIInfo
       * @param showLoading 是否显示loading
       * @param messageError 调用后台报错时是否直接显示弹出错误信息
       * @param showLoadingAnimotion 是否显示loading动画
       * @param partition 分区
       * @returns Promise<EI.EIInfo>
       */
      callService(svcName: string, data: EI.EIInfo, showLoading?: boolean | ILoadingOptions, messageError?: boolean, showLoadingAnimotion?: boolean, partition?: string): Promise<EI.EIInfo>;
      /**
      * 调用授权分区service
      * @param svcName 服务名称
      * @param data 传入数据
      * @param showLoading 是否显示loading
      * @param messageError 错误时是否显示Error信息
      * @param showLoadingAnimotion 是否显示loading动画
      * @param serviceTransformer 请求/响应数据处理回调函数
      * @returns Promise<EI.EIInfo>
      */
      callMasterEPService(svcName: string, data: EI.EIInfo, showLoading?: boolean, messageError?: boolean, showLoadingAnimotion?: boolean, serviceTransformer?: {
        autoId: boolean;
        autoColumnToUpper: boolean;
      }): Promise<EI.EIInfo>;
      /**
       * 动态SQL查询
       * @param svcName 自定义服务名称，传空时默认系统服务
       * @param sqlScriptArray SQL脚本数组
       * @returns Promise EI.EIInfo
       */
      querySql(svcName: string, ...sqlScriptArray: string[]): Promise<EI.EIInfo>;
      /**
       * 弹出Confirm确认对话框
       * @param message 显示的对话内容，为空时默认[是否确认操作?]
       * @returns Promise boolean
       */
      messageConfirm(message?: string | {
        title: string;
        content: any;
        okType: string;
      }): Promise<boolean>;
      /**
       * 在页面上侧中间显示提示信息栏
       * @param text 显示文本内容,默认为[操作成功]
       */
      messageSuccess(text?: string): void;
      /**
       * 在页面上侧中间显示提示信息栏
       * @param text 显示文本内容
       */
      messageInfo(text: string): void;
      /**
       * 在页面上侧中间显示警告信息栏
       * @param text 显示文本内容
       */
      messageWarning(text: string): void;
      /**
       * 在页面上侧中间显示错误信息栏
       * @param text 显示文本内容
       */
      messageError(text: string): void;
      /**
       * 根据数据生成EiBlock对象
       * @param data 数据
       * @param tableName BlockName
       * @returns EiBlock
       */
      buildEiBlock(data?: any[], tableName?: string): EI.EiBlock;
      /**
       * 获取配置区域绑定的数据源的当前行数据
       * @param configId Grid
       * @returns Model | undefined
       */
      getCurrentDataObject(configId: string): Model | undefined;
      /**
       * 结束Grid编辑模式
       * @param grid grid[可传入多个grid配置代码的数组或用逗号隔开的字符串]
       * @param callBack 回调函数
       */
      stopGridEditing<T>(grid: any, callBack: () => T): Promise<T>;
      /**
       * 删除Grid的选中行[无勾选框时为当前行]
       * @param grid Grid
       * @param confirmMsg 是否提示确认
       */
      deleteGridRows(grid: any, confirmMsg?: boolean): Promise<boolean>;
      /**
       * 设置grid的焦点
       * @param grid Grid
       * @param rowIndex rowIndex
       * @param colKey colKey ｜ Column
       */
      setGridFocusedCell(grid: any, rowIndex?: number, colKey?: any): void;
      /**
       * 更新Grid行的值
       * @param grid Grid或配置Id
       * @param row ER.Model或ER.Model的uid
       * @param colKey colKey ｜ Column
       */
      setGridRowData(grid: any, row: any, newData: {
        [key: string]: any;
      }, ignoreExistValue?: boolean): FormHelper;
      /**
      * 设置Grid行数据的状态
      * @param grid Grid或配置Id
      * @param row ER.Model或ER.Model的uid
      * @param state 'added' | 'updated' | 'unchanged'
      */
      setGridRowState(grid: any, row: any, state: 'added' | 'updated' | 'unchanged'): FormHelper;
      /**
       * 获取Grid绑定的DataTable
       * @param grid
       * @returns DataTable | undefined
       */
      getGridBindingTable(grid: any): DataTable | undefined;
      /**
       * 获取Grid的选中行[无勾选框时为当前行]
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridSelectRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的选中行[无勾选框时为当前行]EiBlock
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridSelectRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的当前焦点行
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns kendo.data.ObservableObject or Json
       */
      getGridCurrentRow(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any;
      /**
       * 获取Grid的当前焦点行
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridCurrentRowAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的选中行[必须在有勾选列的情况下]
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridCheckedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的选中行的数据
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridCheckedRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已删除的行
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridDeletedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已删除的行Block
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns Block
       */
      getGridDeletedRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已修改的行
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridModifyRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已修改的行Block
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridModifyRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已新增的行Json
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridCreatedRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已新增的行Block
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridCreatedRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid已新增的行Json
       * @param grid
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridAllRows(grid: any, toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid已新增的行Block
       * @param grid
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridAllRowsAsBlock(grid: any, extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 获取Grid的变更集并添加到EIInfo[块名分别为:{tableName}_DELETE,{tableName}_MODIFY,{tableName}_ADD]
       * @param grid grid[可传入多个grid配置代码的数组或用逗号隔开的字符串]
       * @param EIInfo 传入的EiInfo
       * @param tableName 相关表名[当传入的grid参数为长度大于1的数组时该参数不起作用，使用默认的绑定表]
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EIInfo
       */
      getGridChangedRowsAsEiInfo(grid: any, inInfo?: EI.EIInfo, tableName?: string, onlyGridColumns?: boolean): EI.EIInfo;
      /**
       * 获取Grid的的行
       * @param grid grid对象
       * @param type 行类型
       * @param toJson 是否将对象转换成Json
       * @param onlyGridColumns 是否仅获取Grid中存在的字段[toJson === true ]
       * @returns array
       */
      getGridRows(grid: any, type: 'current' | 'select' | 'checked' | 'add' | 'modify' | 'delete' | 'all', toJson?: boolean, onlyGridColumns?: boolean): any[];
      /**
       * 获取Grid的的行
       * @param grid grid对象
       * @param type 行类型
       * @param extendJsonData 附加Json数据，只赋值到EiBlock的第一行数据
       * @param onlyGridColumns 是否仅获取Grid中存在的字段
       * @returns EiBlock
       */
      getGridRowsAsBlock(grid: any, type: 'current' | 'select' | 'checked' | 'add' | 'modify' | 'delete' | 'all', extendJsonData?: {
        [key: string]: any;
      }, onlyGridColumns?: boolean): EI.EiBlock;
      /**
       * 设置工具栏Grid工具栏按钮是否可见
       * @param configId  Grid配置代码
       * @param buttonOptions  按钮选项[系统预置按钮'refresh' | 'addrow' | 'copyrow' | 'delete' | 'save' | 'cancel' | 'excel' | 'import']
       * @param commonOptions  通用选项[showToolBar, showIco, showText]
       * @returns this
       */
      initialGridToolbar(configId: string, buttonOptions: {
        [key: string]: {
          visible: boolean;
          caption?: string;
          ico?: any;
          action?: Function;
          preventDefault?: boolean;
          showIco?: boolean;
          showText?: boolean;
        };
      }, commonOptions?: {}): FormHelper;
      /**
       * 设置工具栏Grid工具栏按钮是否可见
       * @param configId  Grid配置代码
       * @param toolbarVisible  按钮是否可见
       * @returns this
       */
      setGridToolbarVisible(configId: string, toolbarVisible: {
        [key: 'refresh' | 'addrow' | 'copyrow' | 'delete' | 'save' | 'cancel' | 'excel' | 'import' | string]: boolean;
      }): FormHelper;
      /**
       * 获取工具栏Grid工具栏按钮是否可见
       * @param configId  Grid配置代码
       * @param name  按钮名称
       * @returns boolean
       */
      getGridToolbarVisible(configId: string, name: string): boolean;
      /**
       * 从一个GridDataRow向另一个GridDataRow复制值
       * @param newDataRow
       * @param fromDataRow
       * @returns newDataRow
       */
      mergeGridDataRow(newDataRow: Model, fromDataRow: any, ignoreWhenExistValue?: boolean): Model;
      /**
       * 将EJson对象数组添加到EiBlock
       * @param data
       * @param block
       * @returns EiBlock
       */
      addJsonToEiBlock(data: {
        [key: string]: any;
      }[], block?: any): EI.EiBlock;
      /**
       * Merge数据到dataTable
       * @param data 原数据
       * @param dataTable dataTable
       * @param clearExistData 是否清空已有数据，默认为true
       * @returns total
       */
      mergeDataToDataTable(data: any, dataTable: DataTable, clearExistData?: boolean): number;
      /**
       * 将数据绑定到Grid
       * @param data
       * @param grid grid对象或配置代码[例如:'gridView1']
       * @returns rowsCount
       */
      mergeDataToGrid(data: any, grid: any, clearExistData?: boolean): number;
      /**
       * EiBlock的数据绑定到Grid
       * @param grid grid对象或配置代码[例如:'gridView1']
       * @param block EI.EiBlock
       * @returns rowsCount
       */
      mergeEiBlockToGrid(block: EI.EiBlock, grid: any, clearExistData?: boolean): number;
      /**
       * 将EIInfo的数据绑定到Grid
       * @param inInfo EI.EIInfo
       * @param grid grid对象或配置代码[例如:'gridView1']
       * @returns rowsCount
       */
      mergeEiInfoToGrid(inInfo: EI.EIInfo, ...grids: any[]): void;
      /**
       * 清空Grid数据
       * @param grid grid对象或配置代码数组[例如:'gridView1']
       * @returns void
       */
      clearGridData(...grids: any[]): void;
      /**
       * 清空Layout数据[当与Grid绑定同一张数据表时，需用clearGridData方法]
       * @param configs 区域配置代码数组,例如:[例如:'LayoutGroupMain']
       * @returns void
       */
      clearLayoutData(...configs: string[]): void;
      /**
       * 清空Layout或Grid数据
       * @param configs 区域配置代码数组,例如:['LayoutGroupMain','gridView1']
       * @returns void
       */
      clearLayoutOrGridData(...configs: string[]): void;
      /**
       * 设置Grid的服务器端分页查询方法
       * @param grid grid对象或者grid配置代码
       * @param serverPageFilter 查询条件
       * @param pageQuery 查询方法
       * @returns void
       */
      setGridServerPagingQuery<T extends Promise<any>>(grid: string, serverPageFilter: EI.EIInfo, pageQuery: (queryPage: number) => T, autoQuery?: boolean): void;
      /**
       * 设置Grid的服务器端分页查询服务
       * @param grid grid对象或者grid配置代码
       * @param serverPageFilter 查询条件
       * @param serviceName 查询服务
       * @returns void
       */
      setGridServerPagingService(grid: string, serverPageFilter: EI.EIInfo, serviceName: string, autoQuery?: boolean): void;
      /**
       * 设置Grid的服务器端分页查询服务
       * @param grid grid对象或者grid配置代码
       * @param serverPageFilter 查询条件
       * @param dataSourceId 数据源配置代码
       * @param serviceName 查询服务
       * @returns void
       */
      setGridServerPagingDataSource(grid: string, serverPageFilter: EI.EIInfo, dataSourceId: string, serviceName: string, autoQuery?: boolean): void;
      /**
       * 调用Grid分页查询方法[服务端分页]
       * @param configId Grid配置代码
       * @param readOptions 参数
       * @returns void
       */
      excuteGridServerPaging(grid: any, queryPage: number): Promise<any>;
    }
    /**
   * 通用查询工具类
   */
    class PopQueryHelper {
      /**
       * 服务分区
       */
      get Partiton(): string;
      /**
       * 画面ID[自动生成的唯一标识]
       */
      get FormId(): string;
      /**
       * 画面名称
       */
      get FormName(): string;
      /**
       * 初始化成功标志
       */
      get InitializeFlag(): number;
      /**
       * 画面工具类
       */
      get ErFormHelper(): FormHelper;
      /**
       * 画面返回信息
       */
      get DialogReturnInfo(): PopQueryReturnInfo;
      /**
       * 画面Caption
       */
      FormCaption: string;
      /**
       * 自定义查询条件脚本
       */
      CustomFilterString: string;
      /**
       * 自定义查询条件信息
       */
      CustomFilterJson: {
        [key: string]: any;
      };
      /**
       * app
       */
      app: any;
      /**
       * div
       */
      div: any;
      /**
       * 自定义查询条件信息
       */
      DefaultValues: {
        values: {
          [key: string]: any;
        };
        readonly?: {
          [key: string]: boolean;
        };
      };
      /**
       * 接收查询条件
       */
      ReceiveFilter: {};
      /**
       * 画面上下文
       */
      Context: undefined;
      /**
       * 获取画面是否打开状态
       */
      WindowOpened: import("vue").Ref<boolean>;
      DataModelId: string;
      ShowCheckBoxColumn: boolean;
      ShowQueryButton: boolean;
      ShowOkButton: boolean;
      ShowCancelButton: boolean;
      ShowClearButton: boolean;
      QueryButtonCaption: string;
      OkButtonCaption: string;
      CancelButtonCaption: string;
      ClearButtonCaption: string;
      CloseDialogWhenOkClick: boolean;
      ShowQueryNoDetailInfoMsg: boolean;
      OkButtonPreventDefault: boolean;
      UnMountWhenCloseDialog: boolean;
      AutoQuery: boolean;
      AutoRefresh: boolean;
      KeyFieldName: string;
      DescFieldName: string;
      ChooseKeyValues: string;
      ReceiveJsonData: {
        [key: string]: any;
      }[];
      LayoutGroupFilterId: string;
      MainViewConfigId: string;
      DetailViewConfigId: string;
      private _partition?;
      private _formName;
      private _layoutConfigIds;
      private _sysConfiParas?;
      private _serviceName;
      private _initializeFlag;
      private _formHelper;
      private _dialogReturnInfo;
      private _mainTableame;
      private _detailTableame;
      private _queryService;
      private _serviceFilter;
      private _keyFieldValue;
      private _events;
      private _formOptions;
      /**
       * 工具类构造函数
       * @param partition 分区
       * @param formName 配置画面名
       * @param configIds 配置区域代码
       * @param serviceName 初始化服务名
       * @param sysConfiParas 初始化参数
       */
      constructor(partition: string, formName: string, configIds?: string, serviceName?: string, sysConfiParas?: {
        [key: string]: string | number;
      });
      /**
       * 初始化工具类
       * @param partition 分区
       * @param serviceName 初始化的服务名
       * @returns Promise<Number> 成功标志
       */
      Initialize(partition?: string, serviceName?: string): Promise<Number>;
      /**
       * 设置画面属性信息
       * @param options 属性信息
       * @returns void
       */
      setFormOptions(options: {
        [key: string]: any;
      }): void;
      /**
       * 获取画面属性信息
       * @param options 属性信息
       * @returns void
       */
      getFormOption(key: string): any;
      /**
       * 设置画面的相关事件
       * @param event 事件'pressEnter', 'focus', 'blur'
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns void
       */
      setEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'filterItemValueChanged' | 'filterItemButtonClick', event: Function | undefined): void;
      /**
       * 获取画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      getEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'filterItemValueChanged' | 'filterItemButtonClick'): Function | undefined;
      /**
       * 执行画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      doEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'filterItemValueChanged' | 'filterItemButtonClick', args?: any): any;
      /**
       * 打开弹出画面
       */
      OpenDialog(): Promise<void>;
      /**
       * 关闭弹出画面
       */
      CloseDialog(): void;
      queryMainGridInfo: () => void;
      /**
       * 自动勾选记录
       */
      private autoCheckRows;
      /**
       * 设置画面返回值
       */
      setDialogReturnInfo(returnInfo: any): void;
    }
    class PopFreeHelper {
      /**
       * 服务分区
       */
      get Partiton(): string;
      /**
       * 画面ID[自动生成的唯一标识]
       */
      get FormId(): string;
      /**
       * 画面名称
       */
      get FormName(): string;
      /**
       * 初始化成功标志
       */
      get InitializeFlag(): number;
      /**
       * 画面工具类
       */
      get FormHelper(): FormHelper;
      /**
       * 画面布局配置代码信息
       */
      get LayoutConfigId(): string | Array<string>;
      /**
       * 画面绑定的数据集
       */
      get DataSet(): DataSet;
      /**
       * 画面绑定的数据表
       */
      get DataTable(): DataTable;
      /**
       * 画面绑定的表名
       */
      get TableName(): string;
      /**
       * 画面返回的数据对象
       */
      get DataModel(): any;
      /**
       * 画面返回信息
       */
      get DialogReturnInfo(): PopFreeReturnInfo;
      /**
       * 画面接收的可编辑信息
       */
      get ReadOnlys(): any;
      /**
       * 画面接收的数据信息
       */
      get ReceiveData(): any;
      /**
       * 画面配置区域panel的描述
       */
      LayoutCaption: string | Array<string>;
      /**
       * 画面接收的是否可编辑属性
       */
      EditType: 'Query' | 'Add' | 'Modify';
      /**
       * 画面上下文
       */
      Context: any;
      /**
       * 获取画面是否打开状态
       */
      WindowOpened: import("vue").Ref<boolean>;
      /**
       * 是否显示确定按钮
       */
      ShowOkButton: boolean;
      /**
       * 是否显示取消按钮
       */
      ShowCancelButton: boolean;
      /**
       * 设置确定按钮的Caption信息
       */
      OkButtonCaption: string;
      /**
       * 设置取消按钮的Caption信息
       */
      CancelButtonCaption: string;
      /**
       * 点击确定按钮时弹出画面是否自动关闭
       */
      CloseDialogWhenOkClick: boolean;
      /**
       * 是否阻止确定按钮的默认事件
       */
      OkButtonPreventDefault: boolean;
      /**
       * 是否阻止取消按钮的默认事件
       */
      CancelButtonPreventDefault: boolean;
      /**
       * 接收确定按钮调用的后台服务service
       */
      OkButtonService: string;
      /**
       * 关闭窗口后是否卸载组件
       */
      UnMountWhenCloseDialog: boolean;
      /**
       * app
       */
      app: any;
      /**
       * div
       */
      div: any;
      private _partition?;
      private _formName;
      private _tableName;
      private _layoutConfigId;
      private layoutGroupIdArray;
      private _sysConfiParas?;
      private _serviceName;
      private _initializeFlag;
      private _formHelper;
      private _dataSet;
      private _dataTable;
      private _mainLayoutId;
      private _dialogReturnInfo;
      private _receiveData;
      private _readOnlys;
      private _events;
      private _formOptions;
      /**
       * 工具类构造函数
       * @param partition 分区
       * @param formName 配置画面名
       * @param configIds 配置区域代码[单个或多个数组]
       * @param serviceName 初始化服务名
       * @param sysConfiParas 初始化参数
       */
      constructor(partition: string, formName: string, configIds?: string | Array<string>, serviceName?: string, sysConfiParas?: {
        [key: string]: string;
      });
      /**
       * 初始化工具类
       * @param partition 分区
       * @param serviceName 初始化的服务名
       * @returns Promise<Number> 成功标志
       */
      Initialize(partition?: string, serviceName?: string): Promise<Number>;
      /**
       * 设置画面属性信息
       * @param options 属性信息
       * @returns void
       */
      setFormOptions(options: {
        [key: string]: any;
      }): void;
      /**
       * 获取画面属性信息
       * @param options 属性信息
       * @returns void
       */
      getFormOption(key: string): any;
      /**
       * 获取传入数据并展示[画面初始时]
       * @param data 默认数据
       * @param readOnlys 只读设置
       * @returns
       */
      ReceiveData(data: {
        [key: string]: any;
      } | Model, readOnlys?: {
        [key: string]: boolean;
      }): void;
      /**
       * 设置画面的相关事件
       * @param event 事件'pressEnter', 'focus', 'blur'
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns void
       */
      setEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close' | 'itemValueChanged' | 'itemButtonClick' | 'pressEnter' | 'focus' | 'blur', event: Function | undefined): void;
      /**
       * 获取画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      getEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close' | 'itemValueChanged' | 'itemButtonClick' | 'pressEnter' | 'focus' | 'blur'): Function | undefined;
      /**
       * 执行画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      doEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close' | 'itemValueChanged' | 'itemButtonClick' | 'pressEnter' | 'focus' | 'blur', args?: any): any;
      /**
       * 对画面相关对象进行赋值[画面打开后]
       * @param itemCode 字段代码
       * @param value 字段值
       * @returns void
       */
      setValue(data: {
        [key: string]: any;
      }): PopFreeHelper;
      /**
       * 获取画面相关对象的属性值[画面打开后]
       * @param itemCode 字段代码
       * @returns 字段值
       */
      getValue(fieldName: string): any;
      /**
       * 打开弹出画面
       */
      OpenDialog(): Promise<void>;
      /**
       * 关闭弹出画面
       */
      CloseDialog(): void;
      /**
       * 设置画面返回值
       */
      setDialogReturnInfo(returnInfo: any): void;
    }
    /**
   * 通用弹出组件工具类
   */
    class PopWindowHelper {
      /**
       * 服务分区
       */
      get Partiton(): string;
      /**
       * 画面ID[自动生成的唯一标识]
       */
      get FormId(): string;
      /**
       * 画面名称
       */
      get FormName(): string;
      /**
       * 画面接收需要显示的画面名称
       */
      FormCaption: string;
      /**
       * 初始化成功标志
       */
      get InitializeFlag(): number;
      /**
       * 画面工具类
       */
      get FormHelper(): any;
      /**
       * 画面返回信息
       */
      get DialogReturnInfo(): PopWindowReturnInfo;
      /**
       * 画面绑定的数据集
       */
      get DataSet(): DataSet;
      /**
       * 画面上下文
       */
      Context: any;
      /**
       * 获取画面是否打开状态
       */
      WindowOpened: import("vue").Ref<boolean>;
      /**
       * 是否显示确定按钮
       */
      ShowOkButton: boolean;
      /**
       * 是否显示取消按钮
       */
      ShowCancelButton: boolean;
      /**
       * 设置确定按钮的Caption信息
       */
      OkButtonCaption: string;
      /**
       * 设置取消按钮的Caption信息
       */
      CancelButtonCaption: string;
      /**
       * 点击确定按钮时弹出画面是否自动关闭
       */
      CloseDialogWhenOkClick: boolean;
      /**
       * 是否阻止确定按钮的默认事件
       */
      OkButtonPreventDefault: boolean;
      /**
       * 关闭窗口后是否卸载组件
       */
      UnMountWhenCloseDialog: boolean;
      /**
       * app
       */
      app: any;
      /**
       * div
       */
      private _partition?;
      private _formName;
      private _configIds;
      private _sysConfiParas?;
      private _serviceName;
      private _initializeFlag;
      private _formHelper;
      private _dataSet;
      private _dialogReturnInfo;
      private _events;
      private _formOptions;
      /**
       * 工具类构造函数
       * @param partition 分区
       * @param formName 配置画面名
       * @param configIds 配置区域代码[单个或多个数组]
       * @param serviceName 初始化服务名
       * @param sysConfiParas 初始化参数
       */
      constructor(partition: string, formName: string, configIds?: string | Array<string>, serviceName?: string, sysConfiParas?: {
        [key: string]: string | number;
      });
      /**
       * 初始化工具类
       * @param partition 分区
       * @param serviceName 初始化的服务名
       * @returns Promise<Number> 成功标志
       */
      Initialize(partition?: string, serviceName?: string): Promise<Number>;
      /**
       * 设置画面属性信息
       * @param options 属性信息
       * @returns void
       */
      setFormOptions(options: {
        [key: string]: any;
      }): void;
      /**
       * 获取画面属性信息
       * @param options 属性信息
       * @returns void
       */
      getFormOption(key: string): any;
      /**
       * 设置画面的相关事件
       * @param event 事件'pressEnter', 'focus', 'blur'
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns void
       */
      setEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close', event: Function | undefined): void;
      /**
       * 获取画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      getEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close'): Function | undefined;
      /**
       * 执行画面的相关事件
       * @param type 事件类型[初始化/打开/确定/取消]
       * @returns event
       */
      doEvent(type: 'initial' | 'open' | 'ok' | 'cancel' | 'close', args?: any): any;
      /**
       * 打开弹出画面
       */
      OpenDialog(): Promise<void>;
      /**
       * 关闭弹出画面
       */
      CloseDialog(): void;
      /**
       * 设置画面返回值
       */
      setDialogReturnInfo(returnInfo: any): void;
    }
    class PopUtils {
      /**
       * 通用弹出查询画面
       * @param compenent ErPopQuery组件
       * @param erPopQueryHelper 画面工具类
       * @param okEvent 确认按钮后调用的事件
       * @param cancelEvent 取消按钮后调用事件
       * @returns void
       */
      static showErPopQuery(compenent: any, erPopQueryHelper: PopQueryHelper, okEvent?: Function, cancelEvent?: Function): void;
      /**
       * 通用弹出表单画面
       * @param compenent ErPopFree组件
       * @param erPopFreeHelper 画面工具类
       * @param okEvent 确认按钮后调用的事件
       * @param cancelEvent 取消按钮后调用事件
       * @returns void
       */
      static showErPopFree(compenent: any, erPopFreeHelper: PopFreeHelper, okEvent?: Function, cancelEvent?: Function): void;
    }
  }
}
declare module "ERX/SiUtils" {
  import { EI } from 'EIX/ei';
  export class SiUtils {
    private static GroupCompanyCode;
    private static DefaultRmbCode;
    /**
     * 公用模块初始化画面service设置
     */
    static FormInitializeService: {
      SI00: string;
      SIFI: string;
      SIAC: string;
    };
    /**
     * 获取客商银行信息
     * @param partition 分区代码
     * @param customCode 客商代码
     * @returns Promise<EIInfo>
     */
    static getCustomBankInfo(parttion: string, customerCode: string): Promise<EI.EIInfo>;
    /**
     * 删除单据信息
     * @param partition 分区代码
     * @param billInfo 单据信息
     * @param svcName 调用后台服务信息
     * @param tableName 传入后台的块名称
     * @returns Promise<EIInfo>
     */
    static deleteBillInfo(partition: string, billInfo: EI.EiBlock | {}, svcName: string, tableName?: string): Promise<EI.EIInfo>;
    /**
     * 单据号查询，单据上翻下翻时使用  QueryType queryType, string companyCode, string tableName, string colName, string billNo, string filter
     * @param partition 分区代码
     * @param queryType 查询类型
     * @param tableName 表名
     * @param colName 列名
     * @param companyCode 公司账套
     * @param billNo 当前单据号
     * @param filter 条件脚本
     * @returns 单据号
     */
    static getBillNo(partition: string, queryType: 'first' | 'pre' | 'next' | 'last', tableName: string, colName: string, companyCode?: string, billNo?: string, filter?: string): Promise<{
      status: number;
      msg: string;
      billNo: string;
    }>;
    /**
     * 获取汇率信息
     * @param partition 分区代码
     * @param currencyCode 币种代码
     * @param accountPeriod 财务期间
     * @param accountPeriod 公司账套
     * @returns Promise<{ Rate: 月初汇率; AdjustRate: 调整汇率 }
     */
    static getCurrencyRate(partition: string, currencyCode: string, accountPeriod?: string, companyCode?: string): Promise<{
      Rate: number;
      AdjustRate: number;
    }>;
    /**
     * 格式化物料的规格信息
     * @param spec 规格信息{MAT_SPEC1:number,MAT_SPEC2:number,MAT_SPEC3:number,MAT_SPEC4:number,MAT_SPEC5:number,MAT_SPEC6:string}
     * @param formatString 格式化格式['{1}*{2}*{3}C', '1*2*3*4*5*6', {n[1-6]}]
     * @returns Promise<EIInfo>
     */
    static getMaterialSpecDesc(spec: {
      [key: string]: any;
    }, formatString?: string): string;
  }

}
declare module "ERX/FiUtils" {
  import { EI } from 'EIX/ei';
  export class FiUtils {
    /**
     * 财务模块初始化画面service设置
     */
    static FormInitializeService: {
      FI00: string;
      FIAP: string;
      FIAR: string;
      FIAN: string;
      FIAF: string;
    };
    /**
     * 获取付款申请信息中的最新客商银行信息
     * @param partition 分区代码
     * @param customerCode 客商代码
     * @returns Promise<EIInfo>
     */
    static getCustomerPayApplyBankInfo(partition: string, customerCode: string): Promise<EI.EIInfo>;
    /**
     * 获取总账核算项目配置信息
     * @param partition 分区代码
     * @param companyCode 公司账套
     * @param accountYear 会计年度
     * @returns Promise<EIInfo>
     */
    static getHoCodeTypeInfo(partition: string, companyCode: string, accountYear: string): Promise<EI.EIInfo>;
  }


}
