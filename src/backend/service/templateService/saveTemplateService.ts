/// <reference types="mongodb" />

import { mongoConfig } from '@/backend/config';
import { TemplateRequestDTO } from '@/backend/types/dto';

export const saveTemplateService = async (
  templateModel: TemplateRequestDTO,
) => {
  if (templateModel) {
    try {
      const templateEntity = {
        type: templateModel.type,
        private: templateModel.private,
        name: templateModel.name,
        desc: templateModel.desc,
        view: templateModel.view,
        author_name: templateModel.author_name,
        author_id: templateModel.author_id,
        status: templateModel.status,
        collect_count: 0,
        like_count: 0,
        use_count: 0,
      };
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);
      const currentTimestamp = new Date().getTime();
      const result = await collection.insertOne({
        ...templateEntity,
        create_time: currentTimestamp,
        update_time: currentTimestamp,
      });
      if (result.acknowledged) {
        return result.insertedId;
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
