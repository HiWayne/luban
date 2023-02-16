import { ComputedDeployRequestDTO } from '../types';

export const verifyDeployParams = (body: ComputedDeployRequestDTO) => {
  if (Reflect.ownKeys(body).length !== 6) {
    throw new Error('缺少参数');
  }
  if (
    !body.category ||
    typeof body.category !== 'string' ||
    !body.category_name ||
    typeof body.category_name !== 'string'
  ) {
    throw new Error('分类值、分类名称不能为空');
  }
  if (!/^[a-zA-Z\d]+$/.test(body.category)) {
    throw new Error('分类值不合法，必须是字母或数字');
  }
  if (body.category_name.length > 20) {
    throw new Error('分类名称不能超过20字符');
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
