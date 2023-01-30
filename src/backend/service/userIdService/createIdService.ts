import { mongoConfig } from '@/backend/config';
import { USER_ID } from './config';

export const createIdService = async ({
  id = USER_ID,
  version,
  count = 1,
}: {
  id: string;
  version: number;
  count?: number;
}) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.idCollectionName);
    const result = await collection.findOneAndUpdate(
      { id, version },
      { $set: { version: version + 1 }, $inc: { value: count } },
    );
    if (result && result.value) {
      return result.value.value + count;
    } else {
      throw new Error('可能存在并发');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
