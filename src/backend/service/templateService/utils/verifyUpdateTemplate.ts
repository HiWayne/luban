import {
  ARRAY,
  BOOLEAN,
  OBJECT,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyUpdateTemplate = (template: any) => {
  const requiredValues: VerifyTypeStructure[] = [{ key: 'id', type: [STRING] }];

  const optionalValues: VerifyTypeStructure[] = [
    { key: 'private', type: [BOOLEAN] },
    { key: 'name', type: [STRING] },
    { key: 'view', type: [OBJECT] },
    { key: 'status', type: ['active', 'inactive'] },
    { key: 'desc', type: [STRING] },
    { key: 'tags', type: [ARRAY] },
    { key: 'collaborators', type: [ARRAY] },
  ];

  return verifyValues(template, requiredValues, optionalValues);
};
