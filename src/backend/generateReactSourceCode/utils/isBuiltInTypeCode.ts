export const _BUILT_IN_TYPE = '_builtInType'

export const isBuiltInFunctionCode = (value: any) =>
  value && value[_BUILT_IN_TYPE] === 'function';

export const isBuiltInVariableCode = (value: any) =>
value && value[_BUILT_IN_TYPE] === 'variable';