import fs from 'fs';
import { TEMP_FILE_PATH } from '@/backend/config';
import { getRandomString } from '@/backend/generateReactSourceCode/utils';
import { normalizePageMeta } from '../utils';
import { generateReactSourceCodeOfFrontstage } from '@/backend/generateReactSourceCode';
import { wrapReactMicroAppHooks } from '@/backend/templates/wrapReactMicroAppHooks';
import { bundleSourceCode } from '@/backend/bundleSourceCode';
import { wrapMicroAppUmdFormation } from '@/backend/templates/wrapMicroAppUmdFormation';
import { Meta, PageModel } from '@/backend/types';

export const generateCodeOfReactMpaInMobile = async (
  virtual: boolean,
  pageModel: PageModel | undefined,
  html: boolean,
  fileName?: string,
  _pageMeta?: Meta,
) => {
  const tempDirPath = TEMP_FILE_PATH;
  if (!html && fileName) {
    const htmlContent = '';

    const bundledCode = await bundleSourceCode(fileName);
    const microAppJsText = wrapMicroAppUmdFormation(
      bundledCode.outputFiles[0].text,
      (_pageMeta as Meta).key,
    );

    return { htmlContent, jsContent: microAppJsText };
  } else if (pageModel) {
    const pageMeta = pageModel.meta;
    const meta = normalizePageMeta(pageMeta);
    const reactSourceCode = wrapReactMicroAppHooks(
      generateReactSourceCodeOfFrontstage(pageModel),
    );
    if (virtual) {
      const name = `temp_${getRandomString()}`;
      const htmlPath = `${tempDirPath}/${name}.html`;
      const filePath = `${tempDirPath}/${name}.js`;
      const pageMetaPath = `${tempDirPath}/${name}.json`;

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="${meta.icon}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${meta.title}</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/virtual/${name}.js></script>
        </body>
      </html>
    `;

      await new Promise((resolve, reject) => {
        const appendFile = () => {
          resolve(
            Promise.all([
              new Promise((resolve1, reject1) => {
                fs.appendFile(
                  htmlPath,
                  htmlContent,
                  {
                    encoding: 'utf-8',
                  },
                  (appendFileError) => {
                    if (appendFileError) {
                      reject1(appendFileError);
                    } else {
                      resolve1(true);
                    }
                  },
                );
              }),
              new Promise((resolve1, reject1) => {
                fs.appendFile(
                  filePath,
                  reactSourceCode,
                  {
                    encoding: 'utf-8',
                  },
                  (appendFileError) => {
                    if (appendFileError) {
                      reject1(appendFileError);
                    } else {
                      resolve1(true);
                    }
                  },
                );
              }),
              new Promise((resolve2, reject2) => {
                fs.appendFile(
                  pageMetaPath,
                  JSON.stringify(pageMeta),
                  {
                    encoding: 'utf-8',
                  },
                  (appendFileError) => {
                    if (appendFileError) {
                      reject2(appendFileError);
                    } else {
                      resolve2(true);
                    }
                  },
                );
              }),
            ]),
          );
        };

        const tempDirExists = fs.existsSync(tempDirPath);
        if (!tempDirExists) {
          fs.mkdir(tempDirPath, (mkdirError) => {
            if (!mkdirError) {
              appendFile();
            } else {
              reject(mkdirError);
            }
          });
        } else {
          appendFile();
        }
      });

      const jsContent = '';

      return { htmlContent: `/virtual/${name}.html`, jsContent };
    } else {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="${meta.icon}" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${meta.title}</title>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          </head>
          <body>
            <div id="root"></div>
            <script src="${pageMeta.path}/${meta.key}.js"></script>
          </body>
        </html>
        `;

      const jsContent = `
        ${reactSourceCode}
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
      `;

      return { htmlContent, jsContent };
    }
  } else {
    return { htmlContent: '', jsContent: '' };
  }
};
