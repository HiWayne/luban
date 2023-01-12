import { getRandomString } from '@/backend/generateReactSourceCode/utils';
import { normalizePageMeta } from '../utils';
import { generateReactSourceCodeOfBackstage } from '@/backend/generateReactSourceCode';
import { Mode, PageModel } from '@/backend/types';

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
    if (!isDeploy) {
      const name = `temp_${getRandomString()}`;

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

      const [setHtmlReply, setJsReply, setJsonReply] =
        await process.context.redis
          .multi()
          .HSET('virtual', name, 'status', 'active')
          .HSET('virtual', name, 'html', htmlContent)
          .HSET('virtual', name, 'js', reactSourceCode)
          .HSET('virtual', name, 'json', JSON.stringify(pageMeta));

      if (isOK(setHtmlReply) && isOK(setJsReply) && isOK(setJsonReply)) {
        const jsContent = '';
        return { htmlContent: `/virtual/${name}.html`, jsContent };
      } else {
        throw new Error('服务器存储错误');
      }
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
    return Promise.reject('页面数据不能为空');
  }
};
