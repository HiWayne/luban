import { BuiltInType, BuiltInTypeCode } from '@/backend/types';

export const _BUILT_IN_TYPE = '_builtInType';

export const isBuiltInFunctionCode = (value: any) =>
  value && value[_BUILT_IN_TYPE] === 'function';

export const isBuiltInVariableCode = (value: any) =>
  value && value[_BUILT_IN_TYPE] === 'variable';

export const createBuiltInTypeCode = (
  type: BuiltInType,
  code: string,
): BuiltInTypeCode => ({
  [_BUILT_IN_TYPE]: type,
  code,
});
