import escapeRegExp from 'lodash/escapeRegExp';
import { mongoConfig } from '@/backend/config';
import { DeployEntity, DeployRecordRequestDTO } from './types';

export const getDeployRecordService = async (
  params: DeployRecordRequestDTO,
) => {
  try {
    const {
      start,
      limit,
      category,
      path,
      update_time_start,
      update_time_end,
      desc,
    } = params;

    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCollectionName);

    const conditions: any = {};
    if (category) {
      conditions.category = category;
    }
    if (path) {
      conditions.path = new RegExp(escapeRegExp(path), 'i');
    }
    if (desc) {
      conditions.desc = new RegExp(escapeRegExp(desc), 'i');
    }
    if (update_time_start) {
      conditions.update_time = { $gte: update_time_start };
    }
    if (update_time_end) {
      conditions.update_time = conditions.update_time
        ? { ...conditions.update_time, $lte: update_time_end }
        : { $lte: update_time_end };
    }

    const [list, total] = await Promise.all([
      collection
        .find(conditions)
        .sort({ update_time: -1 })
        .skip(start)
        .limit(limit)
        .toArray(),
      collection.countDocuments(conditions),
    ]);
    return {
      list: list.map((item: DeployEntity) => ({
        id: item._id,
        category: item.category,
        category_name: item.category_name,
        path: item.path,
        version: item.version,
        update_time: item.update_time,
        operator: item.operator,
        versions_total: item.applications.length,
        status: item.status,
      })),
      more: total > start + limit,
      total,
    };
  } catch (e) {
    return Promise.reject(e);
  }
};
