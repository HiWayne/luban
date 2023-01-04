import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { generateEntrySourceCode } from './generateEntrySourceCode';
import { PageModel } from './types';
import {
  generateReactSourceCodeOfBackstage,
  generateReactSourceCodeOfFrontstage,
} from './generateReactSourceCode';
import { beautifyCode } from './beautifyCode';

const app = fastify();

app.register(fastifyCors, {
  origin: (receivedOrigin, cb) => cb(null, true),
});

app.get('/lubanApp/', async (req, reply) => {
  const { content } = req.query || ({} as any);
  if (content) {
    try {
      const pageModel: PageModel = JSON.parse(content);
      const mode = pageModel.meta.mode;
      const isDevelopment = mode === 'development';
      const { htmlContent } =
        (await generateEntrySourceCode(isDevelopment, pageModel, true)) || {};
      if (isDevelopment) {
        reply.headers({ 'content-type': 'text/html' }).send(htmlContent);
      }
    } catch (e) {
      console.log(e);
      reply
        .code(500)
        .send({ status: 0, data: null, message: '参数错误或服务器错误' });
    }
  } else {
    reply.code(400).send({ status: 0, data: null, message: '内容不能为空' });
  }
});

app.get('/virtual/*', async (req, reply) => {
  const fileNameParam = (req.params as any)['*'];
  const fileName = fileNameParam.replace(/\.js$/, '');
  const mode = 'development';

  const isDevelopment = mode === 'development';
  const { jsContent: microAppJsText } =
    (await generateEntrySourceCode(
      isDevelopment,
      undefined,
      false,
      fileName,
    )) || {};
  if (isDevelopment) {
    reply.headers({ 'content-type': 'text/javascript' }).send(microAppJsText);
  }
});

app.get('/compileToSourceCode/', async (req, reply) => {
  const { content } = req.query || ({} as any);
  if (content) {
    try {
      let sourceCode = '';
      const pageModel: PageModel = JSON.parse(content);
      if (pageModel.meta.env.includes('pc')) {
        sourceCode = generateReactSourceCodeOfBackstage(pageModel);
      } else if (pageModel.meta.env.includes('mobile')) {
        sourceCode = generateReactSourceCodeOfFrontstage(pageModel);
      }

      sourceCode = beautifyCode(sourceCode);

      reply.send({ status: 1, data: sourceCode, message: '' });
    } catch (e) {
      console.log(e);
      reply
        .code(500)
        .send({ status: 0, data: null, message: '参数错误或服务器错误' });
    }
  } else {
    reply.code(400).send({ status: 0, data: null, message: '内容不能为空' });
  }
});

app.get('/api/mock/pagination/', async (req, reply) => {
  const { start = 0 } = req.query || ({} as any);
  const mockList = [
    {
      id: 1423466106,
      type: 'blog',
      content:
        'https://c-ssl.duitang.com/uploads/blog/202209/02/20220902221157_bd1fc.jpeg',
    },
    {
      id: 132075756,
      type: 'atlas',
      content: [
        'https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_59029.jpg',
        'https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_41449.jpg',
        'https://c-ssl.duitang.com/uploads/blog/202109/10/20210910122958_5dfd9.jpeg',
      ],
    },
    {
      id: 22155500,
      type: 'people',
      content: {
        avatar:
          'https://c-ssl.dtstatic.com/uploads/avatar/202209/23/20220923212247_d4030.thumb.200_200_c.jpg',
        username: '栗子味雪糕',
        fans: 34,
      },
    },
  ];
  reply.headers({ 'Access-Control-Allow-Credentials': true }).send({
    status: 1,
    data: {
      object_list: mockList.slice(start, Number(start) + 1),
      total: 3,
    },
  });
});

app.listen({ port: 8000, host: '0.0.0.0' }, (error, address) => {
  if (error) {
    console.error(error);
  }
  console.log(`server is working in: ${address}`);
});
