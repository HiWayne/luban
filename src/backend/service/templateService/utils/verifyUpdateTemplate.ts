import xss from 'xss';
import {
  ARRAY,
  BOOLEAN,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyUpdateTemplate = (template: any) => {
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
    { key: 'id', type: [STRING] },
    { key: 'private', type: [BOOLEAN], required: false },
    { key: 'name', type: [STRING], required: false },
    { key: 'view', type: [ARRAY], required: false },
    { key: 'status', type: ['active', 'inactive'], required: false },
    { key: 'desc', type: [STRING], required: false },
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
