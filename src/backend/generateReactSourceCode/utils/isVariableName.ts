export const isVariableName = (value: any) =>
  typeof value === 'string' && /_scope_variable_/.test(value);
