import { mongoConfig } from '@/backend/config';

export const deleteUserService = async (id: number) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.userCollectionName);
  const result = await collection.deleteOne({ id });
  if (result.acknowledged && result.deletedCount === 1) {
    return true;
  } else {
    return false;
  }
};
