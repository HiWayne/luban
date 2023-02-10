import { Literal } from '@/backend/types/backstage';

export const generateCodeOfLiteral = (literal: Literal) => {
  return literal.raw;
};
