/// <reference types="node" />
export type DataType = 'C' | 'N' | 'D' | 'B' | 'X';
export type ValueType = string | number | boolean | Date | Buffer | null;
export type JsonValueType = string | number | boolean | null;
export declare const __IDField__ = "ID";
export interface IServiceTransformer {
    autoId?: boolean;
    autoColumnToUpper?: boolean;
    requestDataHandler?: (tableName: string, fieldName: string, value: ValueType) => JsonValueType;
    responseDataHandler?: (tableName: string, fieldName: string, value: JsonValueType) => ValueType;
}
export interface ILoadingOptions {
    show: boolean;
    target?: string;
    showAnimation?: boolean;
    ms?: number;
}
