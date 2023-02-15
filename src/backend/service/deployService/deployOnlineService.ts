import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { UserResponseDTO } from '../userService/types';
import { DeployEntity } from './types';
import { getDeployPath, rollbackDeploy } from './utils';

export const deployOnlineService = async (
  id: string,
  user: UserResponseDTO,
) => {
  const mongodb = process.dbContext.mongo;
  const db = mongodb.db(mongoConfig.dbName);
  const collection = db.collection(mongoConfig.deployCollectionName);
  let result;
  try {
    const deploy: DeployEntity = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (!deploy) {
      throw new Error('发布不存在');
    }
    if (deploy.applications.length === 0) {
      throw new Error('没有应用');
    }
    const maxVersion = deploy.applications.reduce((max, application) => {
      if (application.version >= max) {
        return application.version;
      } else {
        return max;
      }
    }, 0);
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'online',
          version: maxVersion,
          operator: { id: user.id, name: user.name, avatar: user.avatar },
        },
      },
    );
    if (result && result.value) {
      const success = await rollbackDeploy(
        { ...deploy, version: maxVersion },
        getDeployPath(result.value.category, result.value.path, true),
      ).catch(() => false);
      if (success) {
        return true;
      } else {
        throw new Error('上线失败');
      }
    }
  } catch (e) {
    if (result) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            version: result.value.version,
            status: result.value.status,
            operator: result.value.operator,
          },
        },
      );
    }
    return Promise.reject(e);
  }
};
