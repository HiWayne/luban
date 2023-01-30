import { mongoConfig } from '@/backend/config';
import { UserEntity, UserRegisterDTO } from './types';
import { formatUserResponse } from './utils';

export const updateUserService = async (
  data: Partial<UserRegisterDTO> & { id: number },
) => {
  try {
    const { id, ...other } = data;
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...other } },
    );
    if (result && result.value) {
      return { ...formatUserResponse(result.value as UserEntity), ...other };
    } else {
      throw new Error('更新失败，请确认是否登录');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
