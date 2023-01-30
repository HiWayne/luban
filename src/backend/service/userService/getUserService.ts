import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { formatUserResponse } from './utils';

export const getUserService = async (id: number) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    if (isExist(id)) {
      const user = await collection.findOne({
        id,
      });
      if (user) {
        const responseUser = formatUserResponse(user);
        return responseUser;
      } else {
        throw new Error('用户不存在');
      }
    } else {
      throw new Error('用户不存在');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
