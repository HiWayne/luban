/// <reference types="mongodb" />

import { mongoConfig } from '@/backend/config';
import {
  SaveTemplateRequestDTO,
  TemplateEntity,
} from '@/backend/service/templateService/types';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { DEFAULT_USER_AVATAR, DEFAULT_USER_NAME } from '../../config';

export const saveTemplateService = async (
  templateModel: SaveTemplateRequestDTO,
  userData: UserResponseDTO,
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
        config: templateModel.config,
        author: {
          author_name: userData.name || DEFAULT_USER_NAME,
          author_id: userData.id || null,
          author_avatar: userData.avatar || DEFAULT_USER_AVATAR,
        },
        status: templateModel.status,
        tags: templateModel.tags || [],
        collaborators: templateModel.collaborators || [],
        collect_count: 0,
        like_count: 0,
        use_count: 0,
        preview: templateModel.preview || null,
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
      return Promise.reject(e);
    }
  } else {
    return Promise.reject('模板数据不能为空');
  }
};
