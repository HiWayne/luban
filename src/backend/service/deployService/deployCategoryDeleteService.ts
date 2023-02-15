import { mongoConfig } from '@/backend/config';
import { CategoryDeleteDTO } from './types';

export const deployCategoryDeleteService = async (body: CategoryDeleteDTO) => {
  const { value } = body;

  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCategoryCollectionName);

  const result = await collection.deleteOne({ value });
  // result { acknowledged: true, deletedCount: 1 }
  if (result.acknowledged && result.deletedCount === 1) {
    return true;
  } else {
    Promise.reject('删除失败');
  }
};
