import { ComputedDeployRequestDTO } from '../types';

export const verifyDeployParams = (body: ComputedDeployRequestDTO) => {
  if (Reflect.ownKeys(body).length !== 5) {
    throw new Error('缺少参数');
  }
  if (!body.category || typeof body.category !== 'string') {
    throw new Error('分类不能为空');
  }
  if (!/^[a-zA-Z\d]+$/.test(body.category)) {
    throw new Error('分类不合法，必须是字母或数字');
  }
  if (!body.pageModel) {
    throw new Error('页面内容不能为空');
  }
  if (
    !/^[^/][a-zA-Z\d]*\/?[a-zA-Z\d]*[^/]$/.test(body.pageModel.meta?.path || '')
  ) {
    throw new Error(
      '路径(pageModel.meta.path)不合法。举例：path、举例：path1/path2',
    );
  }
  if (!body.htmlContent || !body.jsContent) {
    throw new Error('页面内容不能为空');
  }
  return true;
};
