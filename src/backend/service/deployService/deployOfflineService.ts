import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { deleteStatic, getDeployPath } from './utils';
import { UserResponseDTO } from '../userService/types';

export const deployOfflineService = async (
  id: string,
  user: UserResponseDTO,
) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCollectionName);
  let result;
  try {
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'offline',
          operator: { id: user.id, name: user.name, avatar: user.avatar },
        },
      },
    );
    if (result && result.value) {
      const success = await deleteStatic(
        getDeployPath(result.value.category, result.value.path, true),
      ).catch(() => false);
      if (success) {
        return true;
      } else {
        throw new Error('下线失败');
      }
    }
  } catch (e) {
    if (result) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: result.value.status,
            operator: result.value.operator,
          },
        },
      );
    }
    return Promise.reject(e);
  }
};
