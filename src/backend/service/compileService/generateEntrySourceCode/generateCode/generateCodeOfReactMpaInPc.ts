import { getRandomString } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { normalizePageMeta } from '../utils';
import { generateReactSourceCodeOfBackstage } from '@/backend/service/compileService/generateReactSourceCode';
import { Mode, PageModel } from '@/backend/types';
import { bundleSourceCode } from '../../bundleSourceCode';
import { DEPLOY_TARGET } from '../../config';
import { getDeployPath } from '@/backend/service/deployService/utils';

const removeSlashOfEnd = (string: string) =>
  string.replace(/^\//, '').replace(/\/$/, '');

const isOK = (value: any) => value === 'OK';

export const generateCodeOfReactMpaInPc = async (
  mode: Mode,
  pageModel: PageModel | undefined,
  category?: string,
) => {
  const isDeploy = mode === 'deploy';
  const isDevelopment = mode === 'development';
  if (pageModel) {
    const pageMeta = pageModel.meta;
    const meta = normalizePageMeta(pageMeta);
    const reactSourceCode = generateReactSourceCodeOfBackstage(
      pageModel,
      isDevelopment,
    );
    const name = `temp_${getRandomString()}`;
    if (!isDeploy) {
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="${meta.icon || ''}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
          <title>${meta.title || ''}</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/api/virtual/${name}.js></script>
        </body>
      </html>
    `;

      const [setHtmlReply, setJsReply, setJsonReply] =
        await process.dbContext.redis
          .multi()
          .HSET('virtual', name, 'status', 'active')
          .HSET('virtual', name, 'html', htmlContent)
          .HSET('virtual', name, 'js', reactSourceCode)
          .HSET('virtual', name, 'json', JSON.stringify(pageMeta));

      if (isOK(setHtmlReply) && isOK(setJsReply) && isOK(setJsonReply)) {
        return { htmlPath: `/api/virtual/${name}.html` };
      } else {
        throw new Error('服务器存储错误');
      }
    } else if (category) {
      const pathOfPageMeta = removeSlashOfEnd(pageMeta.path);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="${meta.icon || ''}" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            <title>${meta.title || ''}</title>
          </head>
          <body>
            <div id="root"></div>
            <script src="/${DEPLOY_TARGET}${getDeployPath(
        category,
        pathOfPageMeta,
      )}/${meta.key}.js"></script>
          </body>
        </html>
        `;

      const { outputFiles } = await bundleSourceCode(
        name,
        `
      ${reactSourceCode}
      ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    `,
        true,
      );

      const jsContent = outputFiles[0].text;

      return { htmlContent, jsContent };
    } else {
      return Promise.reject('页面分类不能为空');
    }
  } else {
    return Promise.reject('页面数据不能为空');
  }
};
