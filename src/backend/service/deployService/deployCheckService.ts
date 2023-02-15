import { mongoConfig } from '@/backend/config';
import { DeployCheckDTO } from './types';

export const deployCheckService = async (params: DeployCheckDTO) => {
  try {
    const { category, path } = params;
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCollectionName);

    const deploy = await collection.findOne({ category, path });
    if (deploy) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
