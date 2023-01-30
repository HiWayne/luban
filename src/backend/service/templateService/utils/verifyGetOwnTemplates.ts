import { FormatGetTemplatesRequestDTO } from '../types';
import {
  NUMBER,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyGetOwnTemplates = (params: FormatGetTemplatesRequestDTO) => {
  const values: VerifyTypeStructure[] = [
    { key: 'type', type: ['tob', 'toc'], required: false },
    { key: 'name', type: [STRING], required: false },
    { key: 'desc', type: [STRING], required: false },
    { key: 'tags', type: [STRING], required: false },
    { key: 'collaborators', type: [STRING], required: false },
    { key: 'status', type: ['active', 'inactive'], required: false },
    { key: 'start', type: [NUMBER], required: false },
    { key: 'limit', type: [NUMBER], required: false },
  ];

  return verifyValues(params, values);
};
