import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { formatDetailData } from './getOwnTemplatesService';

export const getTemplateDetailService = async (id: string) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.templateCollectionName);
  const template = await collection.findOne({ _id: new ObjectId(id) });
  if (template) {
    return formatDetailData(template);
  } else {
    return Promise.reject('模板不存在');
  }
};
