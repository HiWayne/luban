import { GetTemplatesRequestDTO } from '../types';
import {
  NUMBER,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyGetOwnTemplates = (params: GetTemplatesRequestDTO) => {
  const requiredValues: VerifyTypeStructure[] = [];

  const optionalValues: VerifyTypeStructure[] = [
    { key: 'type', type: ['tob', 'toc'] },
    { key: 'name', type: [STRING] },
    { key: 'desc', type: [STRING] },
    { key: 'tags', type: [STRING] },
    { key: 'collaborators', type: [STRING] },
    { key: 'status', type: ['active', 'inactive'] },
    { key: 'start', type: [NUMBER] },
    { key: 'limit', type: [NUMBER] },
  ];

  return verifyValues(params, requiredValues, optionalValues);
};
