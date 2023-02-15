import fs from 'fs';
import { clearDir } from '@/backend/utils';
import { DeployEntity } from '../types';

export const mkdirOfPagePath = (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (statErr) => {
      if (statErr) {
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  });

export const appendHtml = (path: string, name: string, html: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(`${path}/${name}.html`, html, { encoding: 'utf-8' }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

export const appendJs = (path: string, name: string, js: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(`${path}/${name}.js`, js, { encoding: 'utf-8' }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

export const deleteStatic = (path: string) => {
  return new Promise((resolve, reject) => {
    try {
      clearDir(path);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

export const rollbackDeploy = async (
  targetDeployEntity: DeployEntity | undefined,
  path: string,
) => {
  try {
    if (targetDeployEntity) {
      const version = targetDeployEntity.version;
      const deployedApplication = targetDeployEntity.applications.find(
        (application) => application.version === version,
      );
      if (deployedApplication) {
        await deleteStatic(path);
        const results = await Promise.all([
          appendHtml(
            path,
            deployedApplication.html_name,
            deployedApplication.html_file,
          ),
          appendJs(
            path,
            deployedApplication.js_name,
            deployedApplication.js_file,
          ),
        ]);
        if (results.every((result) => !!result)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      const result = await deleteStatic(path);
      return result;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

export * from './verifyDeployParams';
export * from './verifyDeployChangeVersionParams';
export * from './verifyCategoryCreate';
export * from './verifyDeployRecordRequest';
export * from './getDeployPath';
