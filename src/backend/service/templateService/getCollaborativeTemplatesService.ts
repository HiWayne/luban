import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { formatData } from './getOwnTemplatesService';
import { FormatGetOwnRequestDTO, TemplateEntity } from './types';
import { escapeRegex } from '@/backend/utils';

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
      conditions.name = new RegExp(escapeRegex(name), 'i');
    }
    if (isExist(desc)) {
      conditions.desc = new RegExp(escapeRegex(desc), 'i');
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
        .skip(start)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ ...conditions, status: { $ne: 'delete' } }),
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
