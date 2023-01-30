import { getRandomString } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { normalizePageMeta } from '../utils';
import { generateReactSourceCodeOfBackstage } from '@/backend/service/compileService/generateReactSourceCode';
import { Mode, PageModel } from '@/backend/types';
import { bundleSourceCode } from '../../bundleSourceCode';
import { deployStaticService } from '@/backend/service/deployService';

const removeSlashOfEnd = (string: string) => string.replace(/\/$/, '');

const isOK = (value: any) => value === 'OK';

export const generateCodeOfReactMpaInPc = async (
  mode: Mode,
  pageModel: PageModel | undefined,
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
          <link rel="icon" type="image/svg+xml" href="${meta.icon}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${meta.title}</title>
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
    } else {
      const pathOfPageMeta = removeSlashOfEnd(pageMeta.path);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="${meta.icon}" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            <title>${meta.title}</title>
          </head>
          <body>
            <div id="root"></div>
            <script src="${pathOfPageMeta}/${meta.key}.js"></script>
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

      const result = await deployStaticService(
        pageModel,
        htmlContent,
        jsContent,
      );
      if (result) {
        return { htmlPath: pathOfPageMeta };
      } else {
        return Promise.reject('发布失败');
      }
    }
  } else {
    return Promise.reject('页面数据不能为空');
  }
};
