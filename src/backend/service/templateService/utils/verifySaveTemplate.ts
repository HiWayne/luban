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
  const requiredValues: VerifyTypeStructure[] = [
    { key: 'type', type: [STRING] },
    { key: 'private', type: [BOOLEAN] },
    { key: 'name', type: [STRING] },
    { key: 'view', type: [OBJECT] },
    { key: 'status', type: ['active', 'inactive'] },
  ];

  const optionalValues: VerifyTypeStructure[] = [
    { key: 'desc', type: [STRING] },
    { key: 'author_id', type: [NUMBER] },
    { key: 'tags', type: [ARRAY] },
    { key: 'collaborators', type: [ARRAY] },
  ];

  return verifyValues(template, requiredValues, optionalValues);
};
