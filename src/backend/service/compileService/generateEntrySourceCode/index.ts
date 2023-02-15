import { PageModel } from '@/backend/types';
import {
  generateCodeOfReactMpaInMobile,
  generateCodeOfReactMpaInPc,
} from './generateCode';
import { whichEnv } from './utils';

export const generateEntrySourceCode = async (
  pageModel: PageModel | undefined,
  category?: string,
) => {
  if (pageModel) {
    const pageMeta = pageModel.meta;
    const mode = pageMeta.mode;

    const isReactMpaInPc = whichEnv(pageMeta.env, ['react', 'mpa', 'pc']);
    const isReactMpaInMobile = whichEnv(pageMeta.env, [
      'react',
      'mpa',
      'mobile',
    ]);

    if (isReactMpaInPc) {
      return generateCodeOfReactMpaInPc(mode, pageModel, category);
    } else if (isReactMpaInMobile) {
      return generateCodeOfReactMpaInMobile(mode, pageModel, category);
    } else {
      return Promise.reject('页面目标环境不合法');
    }
  } else {
    return Promise.reject('页面数据不能为空');
  }
};
