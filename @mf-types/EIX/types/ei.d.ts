import { DataType, IServiceTransformer, ValueType } from './type';
import { EITools } from './ei-tools';
export declare namespace EI {
    /**
     * Make all properties in T required
     */
    /**
     * ArrayObject结构的Block
     */
    export class EiBlock {
        constructor(blockName?: string);
        name: string;
        data: {
            [key: string]: ValueType;
        }[];
        columns: IColumnJson[];
        extAttr: Map<string, any>;
        /**
         * 新增数据，可以新增一条或多条数据，第二个参数为true则生成元数据
         * @param data 新增的数据，可以是键值对对象也可以是键值对对象数组
         * @param autoAddColumn 是否添加元数据信息
         */
        pushData(data: {
            [key: string]: ValueType;
        } | {
            [key: string]: ValueType;
        }[], autoAddColumn?: boolean): void;
        /**
         * 获取元数据信息
         * @returns 元数据数组
         */
        getBlockMeta(): IColumnJson[];
        /**
         * 设置元数据信息
         * @param meta 元数据信息
         */
        setBlockMeta(meta: IColumnJson[]): void;
        /**
         * 根据列名或取列对象
         * @param columnName 列名
         * @returns EiColumn | undefined
         */
        getColumn(columnName: string): EiColumn | undefined;
        /**
         * 删除某个字段
         * @param columnName
         * @returns EiBlock
         */
        removeColumn(columnName: string): EiBlock;
        /**
         * 检测当前元数据中是否包含指定字段名的元数据
         * @param columnName
         * @returns boolean
         */
        containsColumn(columnName: string): boolean;
        /**
         * 添加一列
         * @param column 字段名或EiColumn
         * @param defaultValue 默认值 可选参数,不传默认为字符串''
         */
        addColumn(column: EiColumn, defaultValue?: ValueType): void;
        /**
         * 添加一列
         * @param newColumn 字段名
         * @param defaultValue 默认值 可选参数,不传默认为字符串''
         * @param dataType 字段类型，可选参数string| number | Date，不传默认为字符串类型
         */
        addColumn(newColumn: string, defaultValue?: ValueType, dataType?: string): void;
        /**
         * 添加多列
         * @param columnNames 列名字符串数组
         */
        addColumns(...columnNames: string[]): void;
        /**
         * 添加多列
         * @param columnArray EiColumn[]
         */
        addColumns(columnArray: EiColumn[]): void;
        /**
         * 重命名字段名
         * @param oldColumnName 旧字段名
         * @param newColumnName 新字段名
         * @returns EiBlock
         */
        renameColumn(oldColumnName: string, newColumnName: string): EiBlock;
        /**
         * 复制表
         * @param blockName 可选参数，复制出来的表名，不设置为`原表名 copy`
         * @returns EiBlock
         */
        copy(blockName?: string): EiBlock;
        /**
         * 复制表
         * @param {string} blockName 复制出来的表名
         * @param {boolean} excludeRows 是否需要Rows
         * @returns EiBlock
         */
        clone(blockName: string, excludeRows: boolean): EiBlock;
        /**
         * 给block所在列添加行数据
         * @param {Object} rowData 行数据
         * @returns EiBlock
         */
        addRow(rowData: {
            [key: string]: ValueType;
        }): EiBlock;
        /**
         * 删除block指定行数据,返回被删除的数据
         * @param {number} index 行数据
         * @returns Object
         */
        deleteRow(index: number): {
            [key: string]: ValueType;
        };
        /**
         * 添加block指定行数据,返回Eiblock
         * @param {number} index 行数据
         * @returns Object
         */
        insertRow(index: number, rowData: {
            [key: string]: ValueType;
        }): EiBlock;
        toJSON(dataTransformer?: IServiceTransformer): EITools.__BlockJson__;
        /**
         * 通过列英文名数组['field1', 'field2']，或者[{field1: '', field2: ''},{},{}]形式的数组创建EiBlock
         * @param blockId 数据块的id
         * @param data 列名数组或者JSON形式的数据行
         * @return {EiBlock}
         */
        static build(blockId: string, data: string[] | {
            [key: string]: ValueType;
        }[]): EiBlock;
        /**
         * 通过列英文名数组，列中文名数组，创建EiBlock
         *
         * @param blockId 数据块的id
         * @param enames 列英文名数组
         * @param cnames 列中文名数组
         * @return {EiBlock}
         */
        static buildByNames(blockId: string, enames: string[], cnames: string[]): EiBlock;
        /**
         * 通过[{field: '', title: ''}, ...] 数组，创建EiBlock
         *
         * @param blockId 数据块的id
         * @param columns kendoGrid的columns数组
         * @return {EiBlock}
         */
        static buildByColumns(blockId: string, columns: {
            field: string;
            title: string;
            [key: string]: ValueType;
        }[]): EiBlock;
    }
    /**
     * ArrayObject 结构的EIInfo
     */
    export class EIInfo {
        constructor();
        context: EITools.IContent;
        sys: EITools.SysInfo;
        blocks: {
            [key: string]: EiBlock;
        };
        name: string;
        descName: string;
        msg: string;
        msgKey: string;
        detailMsg: string;
        status: number;
        extAttr: {
            [key: string]: any;
        };
        edInfo?: EDInfo;
        /**
         * 取得EiInfo的名称
         * @return {String} EiInfo名称
         */
        getName(): string;
        /**
         * 设置EiInfo的名称
         * @param {String} name EiInfo名称
         */
        setName(name: string): void;
        /**
         * 给EI添加EDInfo属性
         * @param ed
         */
        setED(ed: EDInfo): void;
        /**
         * 给EiInfo添加EiBlock块
         * @param dataBlock EiBlock对象
         * @param blockName 可选参数block名,不传则以block.name作为eiinfo上blocks的键名
         * @returns
         */
        addBlock(eiBlock: EiBlock, blockName?: string): EiBlock;
        /**
         * 检查eiinfo中是否存在block块
         * @param blockName block块名
         * @returns boolean
         */
        contains(blockName: string): boolean;
        /**
         * 根据block块名删除block块
         * @param blockName block块名
         * @returns EiBlock
         */
        remove(blockName: string): EiBlock;
        /**
         * 重命名block名
         * @param oldBlockName 旧block块名
         * @param newBlockName 新block块名
         * @returns EiBlock
         */
        renameBlock(oldBlockName: string, newBlockName: string): EiBlock;
        /**
         * 根据block块名或索引号获取block块
         * @param blockInfo block名或索引号
         * @returns EiBlock
         */
        getBlock(blockInfo: string | number): EiBlock;
        /**
         * 克隆eiinfo
         * @returns EIInfo
         */
        clone(): EIInfo;
        /**
         * 以三段式的方式从EiInfo中获取某字段的值，无法获取值是返回null
         * @param {String} str 三段式blockName-RowNum-ColName 如'result-0-siteArticleButton'
         */
        get(str: string): any;
        /**
         * 根据key名,按照块名、行号、列名规则，以'-'分隔，设置其值.
         */
        set(...argumentArr: ValueType[]): void;
        /**
         * 转还为Json
         */
        toJSON(dataTransformer?: IServiceTransformer): EITools.__EIInfoJson__;
    }
    export class EDInfo implements EITools.__IEDInfo__ {
        constructor();
        fblk_name: EITools.Tuple<string, 63>;
        func_name: EITools.Tuple<string, 63>;
        pk_name: EITools.Tuple<string, 3>;
        pk_val: EITools.Tuple<string, 3>;
    }
    interface IColumnJson {
        pos: number;
        name: string;
        type: DataType;
        descName: string;
        regex?: string;
        formatter?: string;
        editor?: string;
        minLength?: number;
        maxLength?: number;
        primaryKey?: boolean;
        nullable?: boolean;
        visible?: string;
        readonly?: string;
        displayType?: string;
        errorPrompt?: string;
        width?: number;
        height?: number;
        align?: string;
        blockName?: string;
        sourceName?: string;
        labelProperty?: string;
        valueProperty?: string;
    }
    export class EiColumn implements IColumnJson {
        constructor();
        [key: string]: any;
        pos: number;
        name: string;
        type: DataType;
        descName: string;
        regex?: string;
        formatter?: string;
        editor?: string;
        minLength?: number;
        maxLength?: number;
        primaryKey?: boolean;
        nullable?: boolean;
        visible?: string;
        readonly?: string;
        displayType?: string;
        errorPrompt?: string;
        width?: number;
        height?: number;
        align?: string;
        blockName?: string;
        sourceName?: string;
        labelProperty?: string;
        valueProperty?: string;
    }
    export {};
}
