import xss from 'xss';
import { CategoryCreateDTO } from '../types';

export const verifyCategoryCreate = (
  body: CategoryCreateDTO,
): CategoryCreateDTO => {
  if (!body) {
    throw new Error('参数不能为空');
  }
  if (!body.name) {
    throw new Error('分类名称不能为空');
  }
  if (!body.value || !/^[a-zA-Z\d]+$/.test(body.value)) {
    throw new Error('分类值必须是字母或数字');
  }
  return { ...body, desc: body.desc ? xss(body.desc) : '' };
};
