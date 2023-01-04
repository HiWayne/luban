import fs from 'fs';
// import * as swc from '@swc/core';
import { build, OutputFile } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';
import { TEMP_FILE_PATH } from '../config';

export const bundleSourceCode = async (
  fileName: string,
): Promise<{
  outputFiles: OutputFile[];
}> => {
  try {
    return await new Promise((resolve, reject) => {
      const tempDirPath = TEMP_FILE_PATH;
      const filePath = `${tempDirPath}/${fileName}.js`;

      const bundleFile = () =>
        build({
          entryPoints: [filePath],
          jsx: 'automatic',
          format: 'iife',
          bundle: true,
          loader: { '.js': 'jsx', '.css': 'css', '.ts': 'ts', '.tsx': 'tsx' },
          outdir: './dist',
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
        });

      resolve(bundleFile());
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
