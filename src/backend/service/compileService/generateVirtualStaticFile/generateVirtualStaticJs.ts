import { bundleSourceCode } from '../bundleSourceCode';
import {
  wrapMicroAppUmdFormation,
  wrapReactMicroAppHooks,
} from '@/backend/templates';
import { generateVirtualStaticJson } from './generateVirtualStaticJson';

export const generateVirtualStaticJs = async (name: string) => {
  if (name) {
    try {
      const [js, json] = await Promise.all([
        process.dbContext.redis.HGET(name, 'js'),
        generateVirtualStaticJson(name),
      ]);
      const bundledCode = await bundleSourceCode(
        name,
        wrapReactMicroAppHooks(js),
      );
      const microAppJs = wrapMicroAppUmdFormation(
        bundledCode.outputFiles[0].text,
        JSON.parse(json).key,
      );
      return microAppJs;
    } catch (e) {
      return Promise.reject(e ? `构建失败：${e}` : '构建失败');
    }
  } else {
    return Promise.reject('缺少文件名');
  }
};
