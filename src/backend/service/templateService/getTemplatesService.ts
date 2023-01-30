import { ObjectId } from 'mongodb';
import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { FormatGetTemplatesRequestDTO, TemplateEntity } from './types';
import { formatData } from './getOwnTemplatesService';
import { escapeRegex } from '@/backend/utils';

export const getTemplatesService = async (
  params: FormatGetTemplatesRequestDTO,
) => {
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
      conditions.name = new RegExp(escapeRegex(name), 'i');
    }
    if (isExist(desc)) {
      conditions.desc = new RegExp(escapeRegex(desc), 'i');
    }
    if (isExist(author_id)) {
      if (!conditions.author) {
        conditions.author = {};
      }
      conditions.author.author_id = author_id;
    }
    if (isExist(author_name)) {
      conditions.author.author_name = new RegExp(escapeRegex(author_name), 'i');
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
    const [list, total] = await Promise.all([
      collection.find(conditions).skip(start).limit(limit).toArray(),
      collection.countDocuments(conditions),
    ]);
    return {
      list: list.map((item: TemplateEntity) => formatData(item)),
      more: total > start + limit,
      total,
    };
  } catch (e) {
    return Promise.reject(e);
  }
};
