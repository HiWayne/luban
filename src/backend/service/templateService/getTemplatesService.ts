import { ObjectId } from 'mongodb';
import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { GetTemplatesRequestDTO, TemplateEntity } from './types';
import { formatData } from './getOwnTemplatesService';

export const getTemplatesService = async (params: GetTemplatesRequestDTO) => {
  try {
    const {
      id,
      type,
      name,
      desc,
      author_id,
      author_name,
      tags,
      collaborators,
      start = 0,
      limit = 25,
    } = params;

    const conditions: any = {
      status: 'active',
    };

    if (isExist(id)) {
      conditions._id = new ObjectId(id);
    }
    if (isExist(type)) {
      conditions.type = type;
    }
    if (isExist(name)) {
      conditions.name = new RegExp(name!, 'i');
    }
    if (isExist(desc)) {
      conditions.desc = new RegExp(desc!, 'i');
    }
    if (isExist(author_id)) {
      conditions.author_id = author_id;
    }
    if (isExist(author_name)) {
      conditions.author_name = new RegExp(author_name!, 'i');
    }
    if (isExist(tags)) {
      conditions.tags = { $all: tags!.split(',') };
    }
    if (isExist(collaborators)) {
      conditions.collaborators = {
        $all: collaborators!.split(',').map((s) => Number(s)),
      };
    }

    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.templateCollectionName);
    const [list, count] = await Promise.all([
      collection.find(conditions).skip(start).limit(limit).toArray(),
      collection.countDocuments(conditions),
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
