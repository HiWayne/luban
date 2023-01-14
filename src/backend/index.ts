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
import {
  GetOwnRequestDTO,
  GetTemplatesRequestDTO,
  SaveTemplateRequestDTO,
  UpdateTemplateRequestDTO,
  UserResponseDTO,
} from './service/templateService/types';
import { mongoConfig, redisConfig } from './config';
import {
  deleteTemplateService,
  getOwnTemplatesService,
  getTemplatesService,
  saveTemplateService,
  updateTemplateService,
} from './service/templateService';
import {
  verifyGetOwnTemplates,
  verifyGetTemplates,
  verifySaveTemplate,
  verifyUpdateTemplate,
} from './service/templateService/utils';
import {
  checkUsernameService,
  getUserService,
  loginService,
  registerService,
} from './service/userService';
import {
  ACCESS_TOKEN_HEADER,
  REFRESH_TOKEN_HEADER,
} from './service/userService/config';

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

    app.get('/check/username/', async (req, reply) => {
      try {
        const { userName } = req.query || ({} as any);
        if (userName) {
          const result = await checkUsernameService(userName);
          reply.send({ status: 1, data: result, message: '' });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.post('/register/user/', async (req, reply) => {
      try {
        const body = JSON.parse(req.body as string);
        if (body) {
          const response = await registerService(body);
          reply
            .headers({
              [ACCESS_TOKEN_HEADER]: response.accessToken,
              [REFRESH_TOKEN_HEADER]: response.refreshToken,
            })
            .send({ status: 1, data: response.user, message: '' });
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.post('/login/user/', async (req, reply) => {
      try {
        const { userName, password } = req.body || ({} as any);
        if (
          userName &&
          password &&
          typeof userName === 'string' &&
          typeof password === 'string'
        ) {
          const response = await loginService({ userName, password });
          reply
            .headers({
              [ACCESS_TOKEN_HEADER]: response.accessToken,
              [REFRESH_TOKEN_HEADER]: response.refreshToken,
            })
            .send({ status: 1, data: response.user, message: '' });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数错误' });
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.get('/get/user/', async (req, reply) => {
      try {
        const { id } = req.query || ({} as any);
        let user: UserResponseDTO | null = null;
        if (isExist(id)) {
          user = await getUserService(req, Number(id));
        } else {
          user = await getUserService(req);
        }
        reply.send({
          status: 1,
          data: user,
          message: user === null ? 'accessToken已过期' : '',
        });
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.post('/save/template/', async (req, reply) => {
      try {
        // TODO:查询请求身份，得到userId作为authorName
        const userName = '';
        if (req.body) {
          let templateModel: SaveTemplateRequestDTO = null as any;
          try {
            templateModel = JSON.parse(req.body as string);
          } catch {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '模板json解析失败' });
          }
          if (templateModel) {
            try {
              const legal = verifySaveTemplate(templateModel);
              if (legal) {
                const result = await saveTemplateService(
                  templateModel,
                  userName,
                );
                if (result) {
                  reply.send({ status: 1, data: result, message: '' });
                } else {
                  reply
                    .status(500)
                    .send({ status: 0, data: null, message: '保存模板失败' });
                }
              } else {
                reply
                  .status(400)
                  .send({ status: 0, data: null, message: '参数不正确' });
              }
            } catch (e) {
              reply.status(500).send({ status: 0, data: null, message: e });
            }
          }
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.put('/update/template/', async (req, reply) => {
      try {
        // TODO:查询请求身份，得到userId作为authorId
        const userId = 0;

        if (req.body) {
          let templateModel: UpdateTemplateRequestDTO = null as any;
          try {
            templateModel = JSON.parse(req.body as string);
          } catch {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '模板json解析失败' });
          }
          if (templateModel) {
            const legal = verifyUpdateTemplate(templateModel);
            if (!legal) {
              reply
                .status(400)
                .send({ status: 0, data: null, message: '参数不正确' });
            } else {
              try {
                const result = await updateTemplateService(
                  templateModel,
                  userId,
                );
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
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '数据不能为空' });
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
      }
    });

    app.get('/get/templates/', async (req, reply) => {
      const params: GetTemplatesRequestDTO = req.query as any;
      if (params) {
        if (isExist(params.author_id)) {
          params.author_id = Number(params.author_id);
        }
        if (isExist(params.start)) {
          params.start = Number(params.start);
        }
        if (isExist(params.limit)) {
          params.limit = Number(params.limit);
        }
        const legal = verifyGetTemplates(params);
        if (legal) {
          try {
            const result = await getTemplatesService(params);
            reply.send({ status: 1, data: result, message: '' });
          } catch (e) {
            reply.status(500).send({ status: 0, data: null, message: e });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        }
      } else {
        reply.status(400).send({ status: 0, data: null, message: '缺少参数' });
      }
    });

    app.get('/get/own/templates/', async (req, reply) => {
      try {
        // TODO:查询请求身份，得到userId作为authorId
        const userId = 0;
        const params: GetOwnRequestDTO = (req.query as any) || {};
        if (!verifyGetOwnTemplates(params)) {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        } else {
          const result = await getOwnTemplatesService(params, userId);
          reply.send({ status: 1, data: result, message: '' });
        }
      } catch (e) {
        reply.status(500).send({ status: 0, data: null, message: e });
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
