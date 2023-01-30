import { GetTemplatesRequestDTO } from '../types';
import {
  NUMBER,
  STRING,
  VerifyTypeStructure,
  verifyValues,
} from './verifyValues';

export const verifyGetTemplates = (params: GetTemplatesRequestDTO) => {
  const values: VerifyTypeStructure[] = [
    { key: 'type', type: ['tob', 'toc'], required: false },
    { key: 'id', type: [STRING], required: false },
    { key: 'name', type: [STRING], required: false },
    { key: 'desc', type: [STRING], required: false },
    { key: 'author_name', type: [STRING], required: false },
    { key: 'author_id', type: [NUMBER], required: false },
    { key: 'tags', type: [STRING], required: false },
    { key: 'collaborators', type: [STRING], required: false },
    { key: 'start', type: [NUMBER], required: false },
    { key: 'limit', type: [NUMBER], required: false },
  ];

  return verifyValues(params, values);
};
