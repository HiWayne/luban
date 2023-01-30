import { mongoConfig } from '@/backend/config';

/**
 *
 * @param {string} userName 用户名
 * @returns {Promise<boolean>} true-可以使用、false-重复
 */
export const checkUsernameService = async (userName: string) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    const repeatUser = await collection.findOne({ name: userName });
    if (repeatUser) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
