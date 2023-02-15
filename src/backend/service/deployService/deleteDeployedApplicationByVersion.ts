import { ObjectId } from 'mongodb';
import { mongoConfig } from '@/backend/config';
import { DeleteDeployDTO, DeployEntity } from './types';
import { deleteStatic, getDeployPath } from './utils';
import { UserResponseDTO } from '../userService/types';

export const deleteDeployedApplicationByVersion = async (
  body: DeleteDeployDTO,
  user: UserResponseDTO,
) => {
  try {
    const { id, version } = body;
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCollectionName);

    const deploy: DeployEntity = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (deploy) {
      const isCurrentVersion = version === deploy.version;
      const index = deploy.applications.findIndex(
        (application) => application.version === version,
      );
      if (index !== -1) {
        const result = await collection.findOneAndUpdate(
          {
            _id: new ObjectId(id),
          },
          {
            $set: isCurrentVersion
              ? {
                  operator: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                  },
                  status: 'offline',
                }
              : {
                  operator: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                  },
                },
            $pull: { applications: { version } },
          },
        );
        if (result && result.value) {
          if (isCurrentVersion) {
            deleteStatic(getDeployPath(deploy.category, deploy.path, true));
          }
          if (result.value.applications.length === 1) {
            collection.deleteOne({ _id: new ObjectId(id) });
          }
          return true;
        } else {
          throw new Error('删除版本失败');
        }
      } else {
        throw new Error('不存在该版本应用');
      }
    } else {
      throw new Error('该发布不存在');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
