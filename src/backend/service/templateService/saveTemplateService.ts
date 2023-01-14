/// <reference types="mongodb" />

import { mongoConfig } from '@/backend/config';
import {
  SaveTemplateRequestDTO,
  TemplateEntity,
} from '@/backend/service/templateService/types';

export const saveTemplateService = async (
  templateModel: SaveTemplateRequestDTO,
  userName: string,
) => {
  if (templateModel) {
    try {
      const templateEntity: Omit<
        TemplateEntity,
        'create_time' | 'update_time' | '_id'
      > = {
        type: templateModel.type,
        private: templateModel.private,
        name: templateModel.name,
        desc: templateModel.desc || '',
        view: templateModel.view,
        author_name: userName || '匿名',
        author_id: templateModel.author_id || null,
        status: templateModel.status,
        tags: templateModel.tags || [],
        collaborators: templateModel.collaborators || [],
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
