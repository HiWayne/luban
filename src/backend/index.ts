import fs from 'fs';
import { default as nodePath } from 'path';
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
  SaveTemplateRequestDTO,
  UpdateTemplateRequestDTO,
} from './service/templateService/types';
import {
  SearchUsersRequestDTO,
  UserRegisterDTO,
  UserResponseDTO,
} from './service/userService/types';
import { HOST, mongoConfig, PORT, redisConfig } from './config';
import {
  deleteTemplateService,
  getCollaborativeTemplatesService,
  getOwnTemplatesService,
  getTemplateDetailService,
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
  refreshTokenService,
  registerService,
  getUserIdFromHeaderService,
  deleteUserService,
  updateUserService,
} from './service/userService';
import {
  ACCESS_TOKEN_HEADER,
  REFRESH_TOKEN_HEADER,
} from './service/userService/config';
import { catchErrorReply } from './utils';
import {
  verifySearchUsers,
  verifyUpdateUserInfo,
  verifyUserInfo,
} from './service/userService/utils';
import { searchUsersService } from './service/userService/searchUsersService';
import {
  verifyCategoryCreate,
  verifyDeployChangeVersionParams,
  verifyDeployParams,
  verifyDeployRecordRequest,
} from './service/deployService/utils';
import {
  deployService,
  deployChangeVersionService,
  getDeployCategoryListService,
  deployCategoryCreateService,
  deployCategoryDeleteService,
  deployCategoryUpdateService,
  getDeployRecordService,
  getDeployDetailService,
  deployCheckService,
  deleteDeployedApplicationByVersion,
  deployOfflineService,
  deployOnlineService,
} from './service/deployService';
import {
  CategoryRequestDTO,
  ComputedDeployRequestDTO,
  DeployRequestDTO,
} from './service/deployService/types';

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

    app.post('/api/generatePage/', async (req, reply) => {
      try {
        const pageModel: PageModel = JSON.parse(req.body as string);
        if (pageModel) {
          const { htmlPath } = (await generateEntrySourceCode(pageModel)) || {};

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
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/virtual/*', async (req, reply) => {
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
            catchErrorReply(e, req, reply);
          }
        } else if (fileType === 'js') {
          try {
            const js = await generateVirtualStaticJs(fileName);
            reply.headers({ 'content-type': 'text/javascript' }).send(js);
          } catch (e) {
            catchErrorReply(e, req, reply);
          }
        } else {
          reply.send({ status: 0, data: null, message: '文件类型不合法' });
        }
      } else {
        reply.send({
          status: 0,
          data: null,
          message: '文件名或文件类型不合法',
        });
      }
    });

    app.post('/api/compileToSourceCode/', async (req, reply) => {
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
        catchErrorReply(e, req, reply);
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

    app.get('/api/get/publickey/', (req, reply) => {
      try {
        fs.readFile(
          nodePath.resolve(__dirname, '../asymmetricEncryptionKeys/public.key'),
          'utf-8',
          (err, publicKey) => {
            if (!err && publicKey) {
              reply.headers({ 'content-type': 'text/plain' }).send(publicKey);
            } else {
              catchErrorReply(err, req, reply);
            }
          },
        );
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/check/username/', async (req, reply) => {
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
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/register/user/', async (req, reply) => {
      try {
        const body = JSON.parse(req.body as string);
        if (body) {
          const verifiedBody = await verifyUserInfo(body);
          const result = await checkUsernameService(verifiedBody.name);
          if (result) {
            const response = await registerService(verifiedBody, req);
            reply
              .headers({
                [ACCESS_TOKEN_HEADER]: response.accessToken,
                [REFRESH_TOKEN_HEADER]: response.refreshToken,
              })
              .send({ status: 1, data: response.user, message: '' });
          } else {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '用户名重复' });
          }
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/login/user/', async (req, reply) => {
      try {
        const { userName, password } =
          JSON.parse(req.body as string) || ({} as any);
        if (
          userName &&
          password &&
          typeof userName === 'string' &&
          typeof password === 'string'
        ) {
          const response = await loginService({ userName, password }, req);
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
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/get/user/', async (req, reply) => {
      try {
        const { id } = (req.query || {}) as any;
        let userId: number;
        if (isExist(id)) {
          userId = Number(id);
        } else {
          const { id: numberId } = await getUserIdFromHeaderService(req);
          userId = numberId;
        }
        const user: UserResponseDTO = await getUserService(userId);
        reply.send({
          status: 1,
          data: user,
          message: user === null ? 'token已过期' : '',
        });
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.put('/api/update/user/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        if (!id) {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '登录异常' });
        } else {
          const body: Partial<UserRegisterDTO> & { id: number } = JSON.parse(
            req.body as string,
          );
          if (body) {
            const verifiedBody = await verifyUpdateUserInfo(body);
            const user = await updateUserService(verifiedBody);
            reply.send({ status: 1, data: user, message: '' });
          } else {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '缺少参数' });
          }
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.delete('/api/delete/user/', async (req, reply) => {
      try {
        const { id: userId } = await getUserIdFromHeaderService(req);
        if (userId !== null) {
          const result = await deleteUserService(userId);
          reply.send({ status: 1, data: result, message: '' });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/search/users/', async (req, reply) => {
      try {
        const query = (req.query || {}) as SearchUsersRequestDTO;
        const verifiedParams = verifySearchUsers(query);
        const result = await searchUsersService(verifiedParams);
        reply.send({ status: 1, data: result, message: '' });
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/refresh/accessToken/', async (req, reply) => {
      try {
        const accessToken = await refreshTokenService(req);
        reply
          .headers({ [ACCESS_TOKEN_HEADER]: accessToken })
          .send({ status: 1, data: true, message: '' });
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/create/template/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const userData = await getUserService(id);
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
              const verifiedTemplateParams = verifySaveTemplate(templateModel);
              const result = await saveTemplateService(
                verifiedTemplateParams,
                userData,
              );
              if (result) {
                reply.send({ status: 1, data: result, message: '' });
              } else {
                console.error('/api/create/template/', '保存模板失败');
                reply
                  .status(500)
                  .send({ status: 0, data: null, message: '保存模板失败' });
              }
            } catch (e) {
              catchErrorReply(e, req, reply);
            }
          }
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.put('/api/update/template/', async (req, reply) => {
      try {
        const { id: userId } = await getUserIdFromHeaderService(req);

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
            try {
              const verifiedTemplateParams =
                verifyUpdateTemplate(templateModel);
              const result = await updateTemplateService(
                verifiedTemplateParams,
                userId,
              );
              if (result) {
                reply.send({ status: 1, data: result, message: '' });
              } else {
                console.error('/api/update/template/', '更新模板失败');
                reply
                  .status(500)
                  .send({ status: 0, data: null, message: '更新模板失败' });
              }
            } catch (e) {
              catchErrorReply(e, req, reply);
            }
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '数据不能为空' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/get/templates/', async (req, reply) => {
      const params = req.query as any;
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
            catchErrorReply(e, req, reply);
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

    app.get('/api/get/own/templates/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const params = (req.query as any) || {};
        if (isExist(params.start)) {
          params.start = Number(params.start);
        }
        if (isExist(params.limit)) {
          params.limit = Number(params.limit);
        }
        if (!verifyGetOwnTemplates(params)) {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        } else {
          const result = await getOwnTemplatesService(params, id);
          reply.send({ status: 1, data: result, message: '' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/get/collaborative/templates/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const params = (req.query as any) || {};
        if (isExist(params.start)) {
          params.start = Number(params.start);
        }
        if (isExist(params.limit)) {
          params.limit = Number(params.limit);
        }
        if (!verifyGetOwnTemplates(params)) {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        } else {
          const result = await getCollaborativeTemplatesService(params, id);
          reply.send({ status: 1, data: result, message: '' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/get/template/detail/', async (req, reply) => {
      try {
        const { id } = (req.query || {}) as any;
        if (id) {
          const detail = await getTemplateDetailService(id);
          reply.send({ status: 1, data: detail, message: '' });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.delete('/api/delete/template/', async (req, reply) => {
      try {
        const id = (req.query as { id: string }).id;
        const result = await deleteTemplateService(id);
        reply.send({ status: 1, data: result, message: '' });
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/deploy/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const user = await getUserService(id);
        if (user) {
          const body: DeployRequestDTO = JSON.parse(req.body as string);
          if (body.pageModel && body.category) {
            const { htmlContent, jsContent } = await generateEntrySourceCode(
              body.pageModel,
              body.category,
            );
            if (htmlContent && jsContent) {
              const computedBody: ComputedDeployRequestDTO = {
                category: body.category,
                category_name: body.category_name,
                pageModel: body.pageModel,
                desc: body.desc || '',
                htmlContent,
                jsContent,
              };
              try {
                verifyDeployParams(computedBody);
                const success = await deployService(computedBody, user);
                if (success) {
                  reply.send({ status: 1, data: true, message: '' });
                } else {
                  reply
                    .status(500)
                    .send({ status: 0, data: null, message: '发布失败' });
                }
              } catch (e) {
                catchErrorReply(e, req, reply);
              }
            }
          } else {
            reply
              .status(400)
              .send({ status: 0, data: null, message: '缺少参数' });
          }
        } else {
          console.error('/api/deploy/', '用户不存在');
          reply
            .status(400)
            .send({ status: 0, data: null, message: '用户不存在' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/deploy/change/version/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const user = await getUserService(id);
        if (user) {
          const body = JSON.parse(req.body as string);
          try {
            verifyDeployChangeVersionParams(body);
            const success = await deployChangeVersionService(body, user);
            if (success) {
              reply.send({ status: 1, data: true, message: '' });
            } else {
              console.error('/api/deploy/change/version/', '发布失败');
              reply
                .status(500)
                .send({ status: 0, data: null, message: '发布失败' });
            }
          } catch (e) {
            catchErrorReply(e, req, reply);
          }
        } else {
          console.error('/api/deploy/change/version/', '用户不存在');
          reply
            .status(400)
            .send({ status: 0, data: null, message: '用户不存在' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/deploy/list/', async (req, reply) => {
      try {
        const verifiedParams = verifyDeployRecordRequest(req.query);
        if (verifiedParams) {
          const data = await getDeployRecordService(verifiedParams);
          reply.send({
            status: 1,
            data,
            message: '',
          });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/deploy/detail/', async (req, reply) => {
      try {
        const id = (req.query as any)?.id;
        if (id) {
          const data = await getDeployDetailService(id);
          reply.send({
            status: 1,
            data,
            message: '',
          });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.delete('/api/deploy/delete/', async (req, reply) => {
      try {
        const body = JSON.parse(req.body as string);
        if (
          body &&
          typeof body.id === 'string' &&
          typeof body.version === 'number'
        ) {
          const { id } = await getUserIdFromHeaderService(req);
          const user = await getUserService(id);
          if (user) {
            const result = await deleteDeployedApplicationByVersion(body, user);
            if (result) {
              reply.send({
                status: 1,
                data: true,
                message: '',
              });
            }
          } else {
            console.error('/api/deploy/delete/', '用户不存在');
            reply
              .status(400)
              .send({ status: 0, data: null, message: '用户不存在' });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/deploy/online/', async (req, reply) => {
      try {
        const body = JSON.parse(req.body as string);
        if (body && body.id) {
          const { id } = await getUserIdFromHeaderService(req);
          const user = await getUserService(id);
          if (user) {
            await deployOnlineService(body.id, user);
            reply.send({ status: 1, data: true, message: '' });
          } else {
            console.error('/api/deploy/online/', '用户不存在');
            reply
              .status(400)
              .send({ status: 0, data: null, message: '用户不存在' });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/deploy/offline/', async (req, reply) => {
      try {
        const body = JSON.parse(req.body as string);
        if (body && body.id) {
          const { id } = await getUserIdFromHeaderService(req);
          const user = await getUserService(id);
          if (user) {
            await deployOfflineService(body.id, user);
            reply.send({ status: 1, data: true, message: '' });
          } else {
            console.error('/api/deploy/offline/', '用户不存在');
            reply
              .status(400)
              .send({ status: 0, data: null, message: '用户不存在' });
          }
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '参数不正确' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/deploy/check/', async (req, reply) => {
      try {
        const { category, path } = req.query as any;
        if (category && path) {
          const result = await deployCheckService({ category, path });
          reply.send({ status: 1, data: result, message: '' });
        } else {
          reply
            .status(400)
            .send({ status: 0, data: null, message: '缺少参数' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.get('/api/category/list/', async (req, reply) => {
      try {
        const params: CategoryRequestDTO = {
          start: 0,
          limit: 25,
        };
        if (req.query) {
          if (!(req.query as any)?.start) {
            params.start = 0;
          } else {
            params.start = Number((req.query as any).start);
          }
          if (!(req.query as any)?.limit) {
            params.limit = 25;
          } else {
            params.limit = Number((req.query as any).limit);
          }
        }
        const data = await getDeployCategoryListService(params);
        reply.send({ status: 1, data, message: '' });
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.post('/api/create/category/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const user = await getUserService(id);
        if (user) {
          const body = JSON.parse(req.body as string);
          try {
            const verifiedBody = verifyCategoryCreate(body);
            if (verifiedBody) {
              await deployCategoryCreateService(verifiedBody, user);
              reply.send({
                status: 1,
                data: true,
                message: '',
              });
            }
          } catch (e) {
            catchErrorReply(e, req, reply);
          }
        } else {
          console.error('/api/create/category/', '用户不存在');
          reply
            .status(400)
            .send({ status: 0, data: null, message: '用户不存在' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.put('/api/update/category/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const user = await getUserService(id);
        if (user) {
          const body = JSON.parse(req.body as string);
          try {
            const verifiedBody = verifyCategoryCreate(body);
            if (verifiedBody) {
              await deployCategoryUpdateService(verifiedBody, user);
              reply.send({
                status: 1,
                data: true,
                message: '',
              });
            }
          } catch (e) {
            catchErrorReply(e, req, reply);
          }
        } else {
          console.error('/api/update/category/', '用户不存在');
          reply
            .status(400)
            .send({ status: 0, data: null, message: '用户不存在' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.delete('/api/delete/category/', async (req, reply) => {
      try {
        const { id } = await getUserIdFromHeaderService(req);
        const user = await getUserService(id);
        if (user) {
          const body = JSON.parse(req.body as string);
          if (body && body.value) {
            await deployCategoryDeleteService(body);
            reply.send({
              status: 1,
              data: true,
              message: '',
            });
          }
        } else {
          console.error('/api/delete/category/', '用户不存在');
          reply
            .status(400)
            .send({ status: 0, data: null, message: '用户不存在' });
        }
      } catch (e) {
        catchErrorReply(e, req, reply);
      }
    });

    app.listen({ port: PORT, host: HOST }, (error, address) => {
      if (error) {
        console.error(error);
      }
      console.log(`server is working in: ${address}`);
    });
  })();
} catch (e) {
  console.error(e);
}
