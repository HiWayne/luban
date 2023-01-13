/// <reference types="mongodb" />

import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { TemplateEntity, TemplateRequestDTO } from '@/backend/types/dto';

export const updateTemplateService = async (
  templateModel: TemplateRequestDTO,
) => {
  if (templateModel) {
    try {
      const id = templateModel.id as string;
      const templateEntity: Partial<TemplateEntity> = {
        private: templateModel.private,
        name: templateModel.name,
        desc: templateModel.desc,
        view: templateModel.view,
        status: templateModel.status,
      };
      const currentTimestamp = new Date().getTime();
      templateEntity.update_time = currentTimestamp;
      delete (templateEntity as any).id;
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...templateEntity } },
      );
      // result { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 }
      if (result.acknowledged) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return Promise.reject(`${e}`);
    }
  } else {
    return Promise.reject('模板数据不能为空');
  }
};
