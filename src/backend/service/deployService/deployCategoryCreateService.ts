import { mongoConfig } from '@/backend/config';
import { UserResponseDTO } from '../userService/types';
import { CategoryCreateDTO } from './types';

export const deployCategoryCreateService = async (
  body: CategoryCreateDTO,
  user: UserResponseDTO,
) => {
  const { name, value, desc } = body;

  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCategoryCollectionName);

  const isExist = await Promise.all([
    collection.findOne({
      name,
    }),
    collection.findOne({
      value,
    }),
  ]);

  if (isExist.some((r) => !!r)) {
    return Promise.reject('分类已存在');
  } else {
    const result = await collection.insertOne({
      name,
      value,
      desc: desc || '',
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      updater: null,
    });
    if (result.acknowledged) {
      return true;
    } else {
      return Promise.reject('创建失败');
    }
  }
};
