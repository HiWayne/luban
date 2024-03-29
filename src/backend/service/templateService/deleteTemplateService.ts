import { mongoConfig } from '@/backend/config';

export const deleteTemplateService = async (id: number) => {
  if (id !== undefined) {
    try {
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);
      const result = await collection.deleteOne({ id });
      // result { acknowledged: true, deletedCount: 1 }
      return result.acknowledged && result.deletedCount === 1;
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.reject('缺少模板id');
  }
};
