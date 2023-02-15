import { mongoConfig } from '@/backend/config';
import { CategoryEntity, CategoryRequestDTO } from './types';

export const getDeployCategoryListService = async (
  params: CategoryRequestDTO,
) => {
  const { start, limit } = params;

  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCategoryCollectionName);

  const [list, total] = await Promise.all([
    collection.find().sort({ _id: -1 }).skip(start).limit(limit).toArray(),
    collection.countDocuments(),
  ]);
  return {
    list: list.map((item: CategoryEntity) => ({
      name: item.name,
      value: item.value,
      desc: item.desc,
      author: item.author,
      updater: item.updater,
    })),
    more: total > start + limit,
    total,
  };
};
