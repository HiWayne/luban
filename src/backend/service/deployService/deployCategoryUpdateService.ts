import { mongoConfig } from '@/backend/config';
import { UserResponseDTO } from '../userService/types';
import { CategoryCreateDTO } from './types';

export const deployCategoryUpdateService = async (
  body: CategoryCreateDTO,
  user: UserResponseDTO,
) => {
  try {
    const { name, value, desc } = body;

    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCategoryCollectionName);

    const result = await collection.findOneAndUpdate(
      { name, value },
      {
        $set: {
          desc,
          updater: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        },
      },
    );
    if (result && result.value) {
      return true;
    } else {
      throw new Error('分类更新失败');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
