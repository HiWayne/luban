/// <reference types="mongodb" />

import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { GetOwnRequestDTO, TemplateEntity } from './types';

export const formatData = (data: any) => {
  if (data) {
    const id = data._id;
    const newData = { id, ...data };
    delete newData._id;
    return newData;
  } else {
    return data;
  }
};

export const getOwnTemplatesService = async (
  params: GetOwnRequestDTO,
  userId: number,
) => {
  const {
    name,
    desc,
    tags,
    collaborators,
    type,
    status,
    start = 0,
    limit = 25,
  } = params;
  try {
    const conditions: any = {
      author_id: userId,
    };

    if (isExist(name)) {
      conditions.name = new RegExp(name!, 'i');
    }
    if (isExist(desc)) {
      conditions.desc = new RegExp(desc!, 'i');
    }
    if (isExist(tags)) {
      conditions.tags = { $all: tags?.split(',') };
    }
    if (isExist(collaborators)) {
      conditions.tags = {
        $all: collaborators?.split(',').map((s) => Number(s)),
      };
    }
    if (isExist(type)) {
      conditions.type = type;
    }
    if (isExist(status)) {
      conditions.status = status;
    }

    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.templateCollectionName);
    const [list, count] = await Promise.all([
      collection
        .find({
          ...conditions,
          status: { $ne: 'delete' },
        })
        .skip(start)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ ...conditions, status: { $ne: 'delete' } }),
    ]);
    return {
      list: list.map((item: TemplateEntity) => formatData(item)),
      more: count > start + limit,
      count,
    };
  } catch (e) {
    return Promise.reject(`${e}`);
  }
};