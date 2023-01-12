import { Mode, PageModel } from '../types';
import {
  generateCodeOfReactMpaInMobile,
  generateCodeOfReactMpaInPc,
} from './generateCode';
import { whichEnv } from './utils';

export const generateEntrySourceCode = async (
  mode: Mode,
  pageModel: PageModel | undefined,
) => {
  if (pageModel) {
    const pageMeta = pageModel.meta;

    const isReactMpaInPc = whichEnv(pageMeta.env, ['react', 'mpa', 'pc']);
    const isReactMpaInMobile = whichEnv(pageMeta.env, [
      'react',
      'mpa',
      'mobile',
    ]);

    if (isReactMpaInPc) {
      return generateCodeOfReactMpaInPc(mode, pageModel);
    } else if (isReactMpaInMobile) {
      return generateCodeOfReactMpaInMobile(mode, pageModel);
    } else {
      return Promise.reject('页面目标环境不合法');
    }
  } else {
    return Promise.reject('页面数据不能为空');
  }
};
