import fs from 'fs';
// import * as swc from '@swc/core';
import { build, OutputFile } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';
import { TEMP_FILE_PATH } from '../config';

export const bundleSourceCode = async (
  name: string,
  sourceCode: string,
): Promise<{
  outputFiles: OutputFile[];
}> => {
  try {
    return await new Promise((resolve, reject) => {
      const tempDirPath = TEMP_FILE_PATH;
      const filePath = `${tempDirPath}/${name}.js`;

      fs.appendFile(filePath, sourceCode, { encoding: 'utf-8' }, (err) => {
        if (err) {
          reject();
        } else {
          resolve(
            build({
              entryPoints: [filePath],
              jsx: 'automatic',
              format: 'iife',
              bundle: true,
              loader: {
                '.js': 'jsx',
                '.css': 'css',
                '.ts': 'ts',
                '.tsx': 'tsx',
              },
              outdir: 'out',
              sourcemap: false,
              write: false,
              minify: true,
              plugins: [
                lessLoader({
                  javascriptEnabled: true,
                }),
              ],
            }).finally(() => {
              fs.rm(filePath, (rmError) => {
                if (rmError) {
                  reject(rmError);
                }
              });
              process.context.redis.sendCommand([
                'HDEL',
                name,
                'html',
                'js',
                'json',
                'status',
              ]);
            }),
          );
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
