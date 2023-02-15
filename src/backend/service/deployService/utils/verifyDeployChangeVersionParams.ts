import { DeployChangeVersionRequestDTO } from '../types';

export const verifyDeployChangeVersionParams = (
  body: DeployChangeVersionRequestDTO,
) => {
  if (Reflect.ownKeys(body).length < 3) {
    throw new Error('缺少参数');
  }
  if (!body.category) {
    throw new Error('缺少分类');
  }
  if (!body.category) {
    throw new Error('缺少分类');
  }
  if (!body.path) {
    throw new Error('缺少路径');
  }
  if (!body.version || typeof body.version !== 'number') {
    throw new Error('缺少版本');
  }
  return true;
};
