import { AxiosPromise, AxiosRequestConfig } from 'axios';
export declare function setBaseURLHandler(baseUrl: string): void;
export default function (config: AxiosRequestConfig): AxiosPromise<any>;
export declare function setExpiredHandler(callback: (args: any) => void): void;
