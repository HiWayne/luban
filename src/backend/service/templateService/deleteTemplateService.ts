import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';

export const deleteTemplateService = async (id: string) => {
  if (id) {
    try {
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      // result { acknowledged: true, deletedCount: 1 }
      return result.acknowledged;
    } catch (e) {
      return Promise.reject(`${e}`);
    }
  } else {
    return Promise.reject('缺少模板id');
  }
};
