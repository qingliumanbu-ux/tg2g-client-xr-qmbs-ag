/*
 * @Description:
 * @Author: Edward
 * @Date: 2023-10-23 13:43:49
 * @LastEditors: Edward
 * @LastEditTime: 2023-11-20 14:08:40
 */
import { changeTheme as changeCurrentTheme } from "EFX/theme";
export const changeTheme = (theme?: string, reload?: boolean): void => {
  if (!window.__POWERED_BY_WUJIE__ || reload) {
    changeCurrentTheme(theme, reload);
  }
};
