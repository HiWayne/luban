import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { DeployEntity } from './types';

export const getDeployDetailService = async (id: string) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCollectionName);

    const deploy: DeployEntity = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (deploy) {
      const responseData: any = { ...deploy };
      responseData.id = responseData._id;
      responseData.applications = deploy.applications.map((application) => {
        const _application: any = { ...application };
        _application.title = _application.page_model.meta.title;
        delete _application.js_file;
        delete _application.html_file;
        delete _application.page_model;
        return _application;
      });
      delete responseData._id;

      return responseData;
    } else {
      throw new Error('发布不存在');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
