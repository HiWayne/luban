import { GetTemplatesRequestDTO } from '../types';
import {
  NUMBER,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyGetTemplates = (params: GetTemplatesRequestDTO) => {
  const requiredValues: VerifyTypeStructure[] = [];

  const optionalValues: VerifyTypeStructure[] = [
    { key: 'type', type: ['tob', 'toc'] },
    { key: 'id', type: [STRING] },
    { key: 'name', type: [STRING] },
    { key: 'desc', type: [STRING] },
    { key: 'author_name', type: [STRING] },
    { key: 'author_id', type: [NUMBER] },
    { key: 'tags', type: [STRING] },
    { key: 'collaborators', type: [STRING] },
    { key: 'start', type: [NUMBER] },
    { key: 'limit', type: [NUMBER] },
  ];

  return verifyValues(params, requiredValues, optionalValues);
};
