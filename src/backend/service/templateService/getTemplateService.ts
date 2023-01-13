/// <reference types="mongodb" />

import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';

const formatData = (data: any) => {
  if (data) {
    const id = data._id;
    const newData = { id, ...data };
    delete newData._id;
    return newData;
  } else {
    return data;
  }
};

export const getTemplateService = async (
  id: string,
  userId?: number,
  userName?: string,
) => {
  if (id) {
    try {
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);
      const result = await collection.findOne({
        _id: new ObjectId(id),
        status: { $ne: 'delete' },
      });
      if (result) {
        // 只有作者自己可以看到失效的模板
        if (result.status === 'inactive') {
          if (
            (userId && result.author_id === userId) ||
            (userName && result.author_name === userName)
          ) {
            return formatData(result);
          } else {
            return null;
          }
        }
        return formatData(result);
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(`${e}`);
    }
  } else {
    return Promise.reject('模板id不正确');
  }
};
