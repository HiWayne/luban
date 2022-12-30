import fs from 'fs';
import { TEMP_FILE_PATH } from '../config';
import { Meta, PageModel } from '../types';
import {
  generateCodeOfReactMpaInMobile,
  generateCodeOfReactMpaInPc,
} from './generateCode';
import { whichEnv } from './utils';

export const generateEntrySourceCode = async (
  virtual: boolean,
  pageModel: PageModel | undefined,
  html: boolean,
  fileName?: string,
) => {
  if (html && pageModel) {
    const pageMeta = pageModel.meta;
    const isInPc = whichEnv(pageMeta.env, ['pc']);
    const isInMobile = whichEnv(pageMeta.env, ['mobile']);
    const isInApp = whichEnv(pageMeta.env, ['app']);

    //   const isReactSpaInPc = whichEnv(pageMeta.env, ['react', 'spa', 'pc']);
    //   const isReactSpaInMobile = whichEnv(pageMeta.env, ['react', 'spa', 'mobile']);
    //   const isReactSpaInApp = whichEnv(pageMeta.env, ['react', 'spa', 'app']);
    const isReactMpaInPc = whichEnv(pageMeta.env, ['react', 'mpa', 'pc']);
    const isReactMpaInMobile = whichEnv(pageMeta.env, [
      'react',
      'mpa',
      'mobile',
    ]);
    const isReactMpaInApp = whichEnv(pageMeta.env, ['react', 'mpa', 'app']);
    //   const isVueSpaInPc = whichEnv(pageMeta.env, ['vue', 'spa', 'pc']);
    //   const isVueSpaInMobile = whichEnv(pageMeta.env, ['vue', 'spa', 'mobile']);
    //   const isVueSpaInApp = whichEnv(pageMeta.env, ['vue', 'spa', 'app']);
    //   const isVueMpaInPc = whichEnv(pageMeta.env, ['vue', 'mpa', 'pc']);
    //   const isVueMpaInMobile = whichEnv(pageMeta.env, ['vue', 'mpa', 'mobile']);
    //   const isVueMpaInApp = whichEnv(pageMeta.env, ['vue', 'mpa', 'app']);

    if (isReactMpaInPc) {
      return generateCodeOfReactMpaInPc(virtual, pageModel, html);
    } else if (isReactMpaInMobile) {
      return generateCodeOfReactMpaInMobile(virtual, pageModel, html);
    }
  } else {
    const tempDirPath = TEMP_FILE_PATH;

    const pageMetaPath = `${tempDirPath}/${fileName}.json`;
    const pageMeta = await new Promise<Meta>((resolve, reject) => {
      fs.readFile(pageMetaPath, { encoding: 'utf-8' }, (error, data) => {
        if (!error) {
          try {
            resolve(JSON.parse(data) as Meta);
          } catch {
            reject(new Error(''));
          }
        } else {
          reject(new Error(''));
        }
      });
    }).finally(() => {
      fs.rm(pageMetaPath, () => {});
    });

    const isReactMpaInPc = whichEnv(pageMeta.env, ['react', 'mpa', 'pc']);
    const isReactMpaInMobile = whichEnv(pageMeta.env, [
      'react',
      'mpa',
      'mobile',
    ]);
    if (isReactMpaInPc) {
      return generateCodeOfReactMpaInPc(
        virtual,
        pageModel,
        html,
        fileName,
        pageMeta,
      );
    } else if (isReactMpaInMobile) {
      return generateCodeOfReactMpaInMobile(
        virtual,
        pageModel,
        html,
        fileName,
        pageMeta,
      );
    }
  }
};
