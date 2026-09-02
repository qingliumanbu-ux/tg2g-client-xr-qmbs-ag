import { IEnvironment, IUserInfo } from './model';
declare class EP {
    constructor();
    get Environment(): IEnvironment;
    get User(): IUserInfo;
}
declare const ep: EP;
export { ep as EP };
