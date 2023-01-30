import { mongoConfig } from '@/backend/config';

export const getVersionService = async (id: string) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.idCollectionName);
    const idData = await collection.findOne({ id });
    if (idData) {
      return idData.version;
    } else {
      const result = await collection.insertOne({
        id,
        value: 0,
        version: 0,
      });
      if (result.acknowledged) {
        return 0;
      } else {
        throw new Error('创建id失败');
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
