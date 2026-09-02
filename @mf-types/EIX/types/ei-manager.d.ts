import { EI } from './ei';
import { AxiosResponse } from 'axios';
import { ILoadingOptions, IServiceTransformer } from './type';
declare class EIManager {
    constructor();
    /**
     * axios post 请求工具方法
     * @param url 请求 url 地址
     * @param data 请求传入块
     * @param serviceTransformer 请求/响应数据处理回调函数
     * @param responseType 请求类型
     * @param headers 请求头
     * @returns Promise<AxiosResponse<any,any>>
     */
    handlePost: (url: string, data: any, serviceTransformer?: IServiceTransformer, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | undefined, headers?: {
        [key: string]: string;
    } | undefined) => Promise<AxiosResponse<EI.EIInfo | any>>;
    /**
     * axios get 请求工具方法
     * @param url 请求 url 地址
     * @param responseType 请求类型
     * @param serviceTransformer 请求/响应数据处理回调函数
     * @returns Promise<AxiosResponse<any,any>>
     */
    handleGet: (url: string, serviceTransformer?: IServiceTransformer, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | undefined) => Promise<EI.EIInfo | any>;
    /**
     * 调用指定分区（或4j应用）的服务
     * @param partName 分区或4j应用名，传入''调用默认分区服务
     * @param svcName 服务名（或4j应用serviceId）
     * @param data 传入block块
     * @param serviceTransformer 请求/响应数据处理回调函数
     * @param headers 请求头，当调用白名单服务的时候需要servicename: ''
     */
    callService(partName: string, svcName: string, data: EI.EIInfo, serviceTransformer?: IServiceTransformer, headers?: {
        [key: string]: string;
    }, loadingOptions?: ILoadingOptions): Promise<EI.EIInfo>;
    /**
     * 调用主授权分区服务
     * @param svcName 服务名（或4j应用serviceId）
     * @param data 传入block块   * @param serviceTransformer 请求/响应数据处理回调函数
     * @param headers 请求头，当调用白名单服务的时候需要servicename: ''
     */
    callMasterEPService(svcName: string, data: EI.EIInfo, serviceTransformer?: IServiceTransformer, headers?: {
        [key: string]: string;
    }, loadingOptions?: ILoadingOptions): Promise<EI.EIInfo>;
    /**
     * 调用属地授权分区服务
     * @param svcName 服务名（或4j应用serviceId）
     * @param data 传入block块
     * @param serviceTransformer 请求/响应数据处理回调函数
     * @param headers 请求头，当调用白名单服务的时候需要servicename: ''
     */
    callEPService(svcName: string, data: EI.EIInfo, serviceTransformer?: IServiceTransformer, headers?: {
        [key: string]: string;
    }, loadingOptions?: ILoadingOptions): Promise<EI.EIInfo>;
    /**
     * 组合url
     * @param svcName 服务名
     * @param partition 分区名(或4J应用名)
     * @returns url
     */
    private buildUrl;
    /**
     * 初始化请求头，添加uuid
     * @param headers
     */
    private initAxiosHeader;
}
declare const eiManager: EIManager;
export { eiManager as EIManager };
