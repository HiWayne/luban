export const isVariableName = (value: any) =>
  typeof value === 'string' && /_scope_variable_name_/.test(value);
