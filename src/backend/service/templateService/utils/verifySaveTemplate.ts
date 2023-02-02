import xss from 'xss';
import { SaveTemplateRequestDTO } from '../types';
import {
  ARRAY,
  BOOLEAN,
  NUMBER,
  OBJECT,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifySaveTemplate = (template: SaveTemplateRequestDTO) => {
  if (
    template.name &&
    !/^[\u4e00-\u9fa5a-zA-Z0-9~!_-]{1,8}$/.test(template.name)
  ) {
    throw new Error(
      '模板名称1~8位字符，只能包含中文、大小写字母、数字、特殊符号: ~!-_',
    );
  }
  if (template.desc && template.desc.length > 200) {
    throw new Error('模板简介最多200字符');
  }

  const values: VerifyTypeStructure[] = [
    { key: 'type', type: ['toc', 'tob'] },
    { key: 'private', type: [BOOLEAN] },
    { key: 'name', type: [STRING], empty: false },
    { key: 'view', type: [ARRAY], empty: false },
    { key: 'config', type: [OBJECT], empty: false },
    { key: 'status', type: ['active', 'inactive'] },
    { key: 'desc', type: [STRING], required: false },
    { key: 'author_id', type: [NUMBER], required: false },
    { key: 'tags', type: [ARRAY], required: false },
    { key: 'collaborators', type: [ARRAY], required: false },
  ];

  if (verifyValues(template, values)) {
    return {
      ...template,
      desc: template.desc ? xss(template.desc) : template.desc,
    };
  } else {
    throw new Error('参数不正确');
  }
};
