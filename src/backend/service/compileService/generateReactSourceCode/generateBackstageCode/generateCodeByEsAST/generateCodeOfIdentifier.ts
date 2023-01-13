import { Identifier } from '@/backend/types/backstage';

export const generateCodeOfIdentifier = (identifier: Identifier) => {
  return identifier.name;
};
