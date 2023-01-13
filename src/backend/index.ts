import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import { isExist } from '@duitang/dt-base';
import { generateEntrySourceCode } from './service/compileService/generateEntrySourceCode';
import { PageModel } from './types';
import {
  generateReactSourceCodeOfBackstage,
  generateReactSourceCodeOfFrontstage,
} from './service/compileService/generateReactSourceCode';
import { beautifyCode } from './service/compileService/beautifyCode';
import {
  generateVirtualStaticHtml,
  generateVirtualStaticJs,
} from './service/compileService/generateVirtualStaticFile';
import { TemplateRequestDTO } from './types/dto';
import { mongoConfig, redisConfig } from './config';
import {
  deleteTemplateService,
  getTemplateService,
  saveTemplateService,
  updateTemplateService,
} from './service/templateService';

const mongoClient = new MongoClient(mongoConfig.url);

const redisClient = createClient({ url: redisConfig.url });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

try {
  (async () => {
    await Promise.all([redisClient.connect(), mongoClient.connect()]);

    process.dbContext = {
      redis: redisClient,
      mongo: mongoClient,
    };

    const app = fastify();

    app.register(fastifyCors, {
      origin: (receivedOrigin, cb) => cb(null, true),
    });

    app.post('/generatePage/', async (req, reply) => {
      try {
        const pageModel: PageModel = JSON.parse(req.body as string);
        if (pageModel) {
          const mode = pageModel.meta.mode;
          const { htmlPath } =
            (await generateEntrySourceCode(mode, pageModel)) || {};

          reply.send({
            status: 1,
            data: { htmlPath },
            message: '',
          });
        } else {
          reply
            .code(400)
            .send({ status: 0, data: null, message: '内容不能为空' });
        }
      } catch (e) {
        reply.code(500).send({ status: 0, data: null, message: e });
      }
    });

    app.get('/virtual/*', async (req, reply) => {
      const fileNameParam = (req.params as any)['*'];
      const match = /([^.]+)\.([^.]+)$/.exec(fileNameParam);
      if (match) {
        const fileName = match[1];
        const fileType = match[2];
        if (fileType === 'html') {
          try {
            const html = await generateVirtualStaticHtml(fileName);
            reply.headers({ 'content-type': 'text/html' }).send(html);
          } catch (e) {
            reply.code(500).send({ status: 0, data: null, message: e });
          }
        } else if (fileType === 'js') {
          try {
            const js = await generateVirtualStaticJs(fileName);
            reply.headers({ 'content-type': 'text/javascript' }).send(js);
          } catch (e) {
            reply.code(500).send({ status: 0, data: null, message: e });
          }
        }
      }
    });

    app.post('/compileToSourceCode/', async (req, reply) => {
      try {
        const pageModel: PageModel = JSON.parse(req.body as string);
        if (pageModel) {
          let sourceCode = '';
          if (pageModel.meta.env.includes('pc')) {
            sourceCode = generateReactSourceCodeOfBackstage(pageModel, false);
          } else if (pageModel.meta.env.includes('mobile')) {
            sourceCode = generateReactSourceCodeOfFrontstage(pageModel, false);
          }

          sourceCode = beautifyCode(sourceCode);

          reply.send({ status: 1, data: sourceCode, message: '' });
        } else {
          reply
            .code(400)
            .send({ status: 0, data: null, message: '内容不能为空' });
        }
      } catch (e) {
        console.log(e);
        reply
          .code(500)
          .send({ status: 0, data: null, message: '参数错误或服务器错误' });
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

    app.post('/save/template/', async (req, reply) => {
      if (req.body) {
        let templateModel: TemplateRequestDTO = null as any;
        try {
          templateModel = JSON.parse(req.body as string);
        } catch {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '模板json解析失败' });
        }
        if (templateModel) {
          try {
            const result = await saveTemplateService(templateModel);
            if (result) {
              reply.send({ status: 1, data: result, message: '' });
            } else {
              reply
                .status(500)
                .send({ status: 0, data: null, message: '保存模板失败' });
            }
          } catch (e) {
            reply.status(500).send({ status: 0, data: null, message: e });
          }
        }
      }
    });

    app.put('/update/template/', async (req, reply) => {
      if (req.body) {
        let templateModel: TemplateRequestDTO = null as any;
        try {
          templateModel = JSON.parse(req.body as string);
        } catch {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '模板json解析失败' });
        }
        if (templateModel) {
          if (!templateModel.id) {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '数据不正确' });
          } else {
            try {
              const result = await updateTemplateService(templateModel);
              if (result) {
                reply.send({ status: 1, data: result, message: '' });
              } else {
                reply
                  .status(500)
                  .send({ status: 0, data: null, message: '保存模板失败' });
              }
            } catch (e) {
              reply.status(500).send({ status: 0, data: null, message: e });
            }
          }
        }
      }
    });

    app.get('/get/template/', async (req, reply) => {
      if (req.query) {
        const { id, user_id, user_name } = req.query as {
          id: string;
          user_id?: string;
          user_name?: string;
        };
        if (isExist(id)) {
          try {
            const result = await getTemplateService(
              id,
              isExist(user_id) ? Number(user_id) : undefined,
              user_name,
            );
            if (result) {
              reply.send({ status: 1, data: result, message: '' });
            } else {
              reply.send({ status: 1, data: null, message: '没有该模板' });
            }
          } catch (e) {
            reply.status(500).send({ status: 0, data: null, message: e });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } else {
        reply.status(400).send({ status: 0, data: null, message: '缺少参数' });
      }
    });

    app.delete('/delete/template/', async (req, reply) => {
      if (req.query) {
        const { id } = req.query as {
          id: string;
        };
        if (id) {
          const result = await deleteTemplateService(id);
          if (result) {
            reply.send({ status: 1, data: true, message: '' });
          } else {
            reply
              .status(500)
              .send({ status: 0, data: null, message: '删除失败' });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } else {
        reply.status(400).send({ status: 0, data: null, message: '缺少参数' });
      }
    });

    app.listen({ port: 8000, host: '0.0.0.0' }, (error, address) => {
      if (error) {
        console.error(error);
      }
      console.log(`server is working in: ${address}`);
    });
  })();
} catch (e) {
  console.error(e);
}
