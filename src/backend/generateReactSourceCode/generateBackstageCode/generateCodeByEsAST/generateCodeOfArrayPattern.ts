import { ArrayPattern } from '@/backend/types/backstage';
import { generateCodeOfArrayExpression } from './generateCodeOfArrayExpression';

export const generateCodeOfArrayPattern = (arrayPattern: ArrayPattern) => {
  return generateCodeOfArrayExpression(arrayPattern as any);
};
