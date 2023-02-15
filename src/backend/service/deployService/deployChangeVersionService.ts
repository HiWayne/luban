import { mongoConfig } from '@/backend/config';
import { DEPLOY_PATH } from '../compileService/config';
import { UserResponseDTO } from '../userService/types';
import { DeployChangeVersionRequestDTO, DeployEntity } from './types';
import { getDeployPath, rollbackDeploy } from './utils';

export const deployChangeVersionService = async (
  { category, path: pathOfMeta, version }: DeployChangeVersionRequestDTO,
  user: UserResponseDTO,
) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.deployCollectionName);

    const pagePath = `${DEPLOY_PATH}${getDeployPath(category, pathOfMeta)}`;

    const deployEntity: DeployEntity | undefined = await collection.findOne({
      category,
      path: pathOfMeta,
    });

    if (deployEntity) {
      const currentApplication = deployEntity.applications.find(
        (application) => application.version === version,
      );
      if (currentApplication) {
        const result = await collection.findOneAndUpdate(
          {
            category,
            path: pathOfMeta,
          },
          {
            $set: {
              version,
              operator: { id: user.id, name: user.name, avatar: user.avatar },
              update_time: new Date().getTime(),
              status: 'online',
            },
          },
        );
        if (result && result.value) {
          const success = await rollbackDeploy(
            { ...deployEntity, version },
            pagePath,
          );
          return success;
        }
      } else {
        throw new Error('该版本不存在');
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
