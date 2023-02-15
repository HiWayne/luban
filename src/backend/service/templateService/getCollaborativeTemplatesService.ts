import escapeRegExp from 'lodash/escapeRegExp';
import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { formatBriefData } from './getOwnTemplatesService';
import { FormatGetOwnRequestDTO, TemplateEntity } from './types';

export const getCollaborativeTemplatesService = async (
  params: FormatGetOwnRequestDTO,
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
    const conditions: any = {};

    if (isExist(name)) {
      conditions.name = new RegExp(escapeRegExp(name), 'i');
    }
    if (isExist(desc)) {
      conditions.desc = new RegExp(escapeRegExp(desc), 'i');
    }
    if (isExist(tags)) {
      conditions.tags = { $all: tags?.split(',') };
    }
    if (isExist(collaborators)) {
      conditions.tags = {
        $all: [userId, ...collaborators!.split(',').map((s) => Number(s))],
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
    const [list, total] = await Promise.all([
      collection
        .find({
          ...conditions,
          status: { $ne: 'delete' },
        })
        .sort({ update_time: -1 })
        .skip(start)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ ...conditions, status: { $ne: 'delete' } }),
    ]);
    return {
      list: list.map((item: TemplateEntity) => formatBriefData(item)),
      more: total > start + limit,
      total,
    };
  } catch (e) {
    return Promise.reject(e);
  }
};
