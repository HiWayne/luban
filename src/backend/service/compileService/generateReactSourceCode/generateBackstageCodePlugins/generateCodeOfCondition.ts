import { Condition } from '@/backend/types';
import { isString, isVariableName } from '../utils';

export const generateCodeOfCondition = (
  reactElement: string,
  condition: Condition,
) => {
  return reactElement
    ? `{${condition[0]} === ${
        isVariableName(condition[1]) || !isString(condition[1])
          ? condition[1]
          : `'${condition[1]}'`
      } ? ${reactElement} : null}`
    : '';
};
