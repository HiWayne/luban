import fs from 'fs';
import { mongoConfig } from '@/backend/config';
import { DEPLOY_PATH } from '../compileService/config';
import {
  appendHtml,
  appendJs,
  rollbackDeploy,
  mkdirOfPagePath,
  deleteStatic,
  getDeployPath,
} from './utils';
import { ComputedDeployRequestDTO, DeployEntity } from './types';
import { UserResponseDTO } from '../userService/types';

const removeSlashOfStartAndEnd = (string: string) =>
  string.replace(/^\//, '').replace(/\/$/, '');

export const deployService = async (
  {
    category,
    category_name,
    pageModel,
    htmlContent,
    jsContent,
    desc,
  }: ComputedDeployRequestDTO,
  user: UserResponseDTO,
) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCollectionName);

  const meta = pageModel.meta;

  const pathOfPageMeta = removeSlashOfStartAndEnd(meta.path);

  const pagePath = `${DEPLOY_PATH}${getDeployPath(category, pathOfPageMeta)}`;

  const isExist: DeployEntity | undefined = await collection.findOne({
    category,
    path: pathOfPageMeta,
  });

  return new Promise((resolve, reject) => {
    fs.stat(DEPLOY_PATH, (statErr) => {
      if (statErr) {
        fs.mkdir(DEPLOY_PATH, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(mkdirOfPagePath(pagePath));
          }
        });
      } else {
        resolve(mkdirOfPagePath(pagePath));
      }
    });
  })
    .then(() => deleteStatic(pagePath))
    .then(() => {
      return Promise.all([
        appendHtml(pagePath, 'index', htmlContent),
        appendJs(pagePath, meta.key, jsContent),
      ])
        .then(() => {
          if (!isExist) {
            const version = 1;
            return collection.insertOne({
              category,
              category_name,
              path: pathOfPageMeta,
              applications: [
                {
                  js_name: meta.key,
                  js_file: jsContent,
                  html_name: 'index',
                  html_file: htmlContent,
                  page_model: pageModel,
                  create_time: new Date().getTime(),
                  version,
                  desc: desc || '',
                  author: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                  },
                },
              ],
              count: 1,
              version,
              operator: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              },
              update_time: new Date().getTime(),
              status: 'online',
            });
          } else {
            const version = isExist.count + 1;
            return collection.findOneAndUpdate(
              { category, path: pathOfPageMeta },
              {
                $set: {
                  count: version,
                  version,
                  operator: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                  },
                  update_time: new Date().getTime(),
                  status: 'online',
                },
                $push: {
                  applications: {
                    js_name: meta.key,
                    js_file: jsContent,
                    html_name: 'index',
                    html_file: htmlContent,
                    page_model: pageModel,
                    create_time: new Date().getTime(),
                    version,
                    desc,
                    author: {
                      id: user.id,
                      name: user.name,
                      avatar: user.avatar,
                    },
                  },
                },
              },
            );
          }
        })
        .then((dbResult) => {
          if (
            (!isExist && dbResult.acknowledged) ||
            (isExist && dbResult && dbResult.value)
          ) {
            return true;
          } else {
            rollbackDeploy(isExist, pagePath);
            return Promise.reject(false);
          }
        })
        .catch((err) => {
          rollbackDeploy(isExist, pagePath);
          return Promise.reject(err);
        });
    });
};
