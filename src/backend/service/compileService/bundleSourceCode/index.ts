import fs from 'fs';
// import * as swc from '@swc/core';
import { build, BuildResult, OutputFile } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';
import { TEMP_FILE_PATH } from '../config';

export const bundleSourceCode = async (
  name: string,
  sourceCode: string,
  production?: boolean,
): Promise<{
  outputFiles: OutputFile[];
}> => {
  const buildConfig = !production ? { minify: false } : { minify: true };
  try {
    const tempDirPath = TEMP_FILE_PATH;
    const filePath = `${tempDirPath}/${name}.js`;

    const checkTempDir = () =>
      new Promise((checkTempDirResolve, checkTempDirReject) => {
        fs.stat(tempDirPath, (err) => {
          if (err) {
            fs.mkdir(tempDirPath, { recursive: true }, (mkdirErr) => {
              if (mkdirErr) {
                checkTempDirReject('创建临时文件夹失败');
              } else {
                checkTempDirResolve(true);
              }
            });
          } else {
            checkTempDirResolve(false);
          }
        });
      });

    const appendFileToTempDir = (): Promise<
      BuildResult & {
        outputFiles: OutputFile[];
      }
    > =>
      new Promise((resolve, reject) => {
        fs.appendFile(filePath, sourceCode, { encoding: 'utf-8' }, (err) => {
          if (err) {
            reject(err);
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
                plugins: [
                  lessLoader({
                    javascriptEnabled: true,
                  }),
                ],
                ...buildConfig,
              }).finally(() => {
                fs.rm(filePath, (rmError) => {
                  if (rmError) {
                    reject(rmError);
                  }
                });
                process.dbContext.redis.sendCommand([
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

    await checkTempDir();

    const result = await appendFileToTempDir();
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};
