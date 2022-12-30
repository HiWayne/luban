import { ObjectPattern } from '@/backend/types/backstage';
import { generateCodeOfObjectExpression } from './generateCodeOfObjectExpression';

export const generateCodeOfObjectPattern = (objectPattern: ObjectPattern) => {
  return generateCodeOfObjectExpression(objectPattern as any);
};
