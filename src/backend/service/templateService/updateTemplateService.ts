/// <reference types="mongodb" />

import { ObjectId } from 'mongodb';
import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import {
  TemplateEntity,
  UpdateTemplateRequestDTO,
} from '@/backend/service/templateService/types';

export const updateTemplateService = async (
  templateModel: UpdateTemplateRequestDTO,
  userId: number,
) => {
  if (templateModel) {
    try {
      const mongodb = process.dbContext.mongo;
      const db = mongodb.db(mongoConfig.dbName);
      const collection = db.collection(mongoConfig.templateCollectionName);

      const id = templateModel.id as string;

      const template: TemplateEntity = await collection.findOne({
        _id: new ObjectId(id),
      });
      if (template) {
        if (
          template.author.author_id !== userId &&
          !template.collaborators.includes(userId)
        ) {
          throw new Error('没有权限更新模板');
        }
      } else {
        throw new Error('模板不存在');
      }

      const templateEntity: Partial<TemplateEntity> = {};
      if (isExist(templateModel.private)) {
        templateEntity.private = templateModel.private;
      }
      if (isExist(templateModel.name)) {
        templateEntity.name = templateModel.name;
      }
      if (isExist(templateModel.desc)) {
        templateEntity.desc = templateModel.desc;
      }
      if (isExist(templateModel.view)) {
        templateEntity.view = templateModel.view;
      }
      if (isExist(templateModel.config)) {
        templateEntity.config = templateModel.config;
      }
      if (isExist(templateModel.status)) {
        templateEntity.status = templateModel.status;
      }
      if (isExist(templateModel.collaborators)) {
        templateEntity.collaborators = templateModel.collaborators;
      }
      if (isExist(templateModel.tags)) {
        templateEntity.tags = templateModel.tags;
      }
      if (isExist(templateModel.preview)) {
        templateEntity.preview = templateModel.preview;
      }
      const currentTimestamp = new Date().getTime();
      templateEntity.update_time = currentTimestamp;
      delete (templateEntity as any).id;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...templateEntity } },
      );
      // result { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 }
      return result.acknowledged;
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.reject('模板更新数据不能为空');
  }
};
