import fs from 'fs';
import { mongoConfig } from '@/backend/config';
import { PageModel } from '@/backend/types';
import { DEPLOY_PATH } from '../compileService/config';

const removeSlashOfEnd = (string: string) => string.replace(/\/$/, '');

export const deployStaticService = async (
  pageModel: PageModel,
  htmlContent: string,
  jsContent: string,
) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCollectionName);

  const meta = pageModel.meta;

  const pathOfPageMeta = removeSlashOfEnd(meta.path);

  const pagePath = `${DEPLOY_PATH}${pathOfPageMeta}`;

  const result = await collection.findOne({ path: pagePath });

  let isUpdate: boolean;

  if (result) {
    isUpdate = true;
  } else {
    isUpdate = false;
  }

  const mkdirOfPagePath = () =>
    new Promise((resolve, reject) => {
      fs.mkdir(pagePath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });

  const appendHtml = () =>
    new Promise((resolve, reject) => {
      fs.appendFile(
        `${pagePath}/index.html`,
        htmlContent,
        { encoding: 'utf-8' },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        },
      );
    });

  const appendJs = () =>
    new Promise((resolve, reject) => {
      fs.appendFile(
        `${pagePath}/${meta.key}.js`,
        jsContent,
        { encoding: 'utf-8' },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        },
      );
    });

  const deleteAllStatic = () => {
    fs.rm(`${pagePath}/index.html`, () => {});
    fs.rm(`${pagePath}/${meta.key}.js`, () => {});
  };

  return new Promise((resolve, reject) => {
    fs.stat(DEPLOY_PATH, (statErr) => {
      if (statErr) {
        fs.mkdir(DEPLOY_PATH, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(mkdirOfPagePath());
          }
        });
      } else {
        resolve(mkdirOfPagePath());
      }
    });
  }).then(() => {
    return Promise.all([appendHtml(), appendJs()])
      .catch((err) => {
        deleteAllStatic();
        return Promise.reject(err);
      })
      .then(() => {
        if (isUpdate) {
          return collection.updateOne(
            { path: pagePath },
            {
              $set: {
                js_name: meta.key,
                html_name: 'index',
                page_model: pageModel,
                update_time: new Date().getTime(),
              },
            },
          );
        } else {
          return collection.insertOne({
            path: pagePath,
            js_name: meta.key,
            html_name: 'index',
            page_model: pageModel,
            create_time: new Date().getTime(),
            update_time: new Date().getTime(),
          });
        }
      })
      .then((dbResult) => {
        if (dbResult.acknowledged) {
          return true;
        } else {
          deleteAllStatic();
          return Promise.reject(false);
        }
      })
      .catch((err) => {
        deleteAllStatic();
        return Promise.reject(err);
      });
  });
};
