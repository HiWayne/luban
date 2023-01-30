import { mongoConfig } from '@/backend/config';
import { escapeRegex } from '@/backend/utils';
import { FormatSearchUsersRequestDTO, UserEntity } from './types';
import { formatUserResponse } from './utils';

export const searchUsersService = async (body: FormatSearchUsersRequestDTO) => {
  try {
    if (
      !body.ids &&
      !body.create_time_start &&
      !body.create_time_end &&
      !body.name
    ) {
      return {
        list: [],
        more: false,
        total: 0,
      };
    }
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    const conditions: any = {};

    if (body.ids) {
      conditions.id = { $in: body.ids };
    } else {
      if (body.name) {
        conditions.name = new RegExp(escapeRegex(body.name), 'i');
      }
      if (body.create_time_start) {
        conditions.create_time = { $gte: body.create_time_start };
      }
      if (body.create_time_end) {
        conditions.create_time = { $lte: body.create_time_end };
      }
    }

    const [list, total] = await Promise.all([
      collection.find(conditions).skip(body.start).limit(body.limit).toArray(),
      collection.countDocuments(conditions),
    ]);
    return {
      list: list.map((item: UserEntity) => formatUserResponse(item)),
      more: total > body.start + body.limit,
      total,
    };
  } catch (e) {
    return Promise.reject(e);
  }
};
