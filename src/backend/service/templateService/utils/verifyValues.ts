export interface VerifyTypeStructure {
  key: string;
  type: string[];
  empty?: boolean;
  required?: boolean;
}

export const STRING = 'STRING';
export const NUMBER = 'NUMBER';
export const ARRAY = 'ARRAY';
export const OBJECT = 'OBJECT';
export const BOOLEAN = 'BOOLEAN';

const originalTypes = [STRING, NUMBER, ARRAY, OBJECT, BOOLEAN];

const verifyType = (
  value: any,
  types: string[],
  config: { empty: boolean; required: boolean },
) => {
  const { empty, required } = config;
  if (!required && value === undefined) {
    return true;
  }
  if (Array.isArray(types)) {
    return types.some((type) => {
      if (originalTypes.includes(type)) {
        switch (type) {
          case STRING:
            return typeof value === 'string' && (!empty ? !!value : true);
          case NUMBER:
            return typeof value === 'number';
          case BOOLEAN:
            return typeof value === 'boolean';
          case ARRAY:
            return Array.isArray(value) && (!empty ? value.length > 0 : true);
          case OBJECT:
            return (
              value &&
              typeof value === 'object' &&
              !Array.isArray(value) &&
              (!empty ? Object.keys(value).length > 0 : true)
            );
          default:
            throw new Error('type不属于verifyType已有的类型');
        }
      } else {
        return value === type;
      }
    });
  } else {
    throw new Error('VerifyTypeStructure 中的 type 类型不合法');
  }
};

export const verifyValues = (data: any, values: VerifyTypeStructure[]) => {
  if (!data) {
    throw new Error('verifyValues 的 data 不能为空');
  }
  if (Array.isArray(values)) {
    const valuesLegal = values.every(
      ({ key, type, empty = true, required = true }) =>
        verifyType(data[key], type, { empty, required }),
    );
    return valuesLegal;
  } else {
    throw new Error(
      'verifyValues 的 requiredValues 和 optionalValues 参数必须是数组',
    );
  }
};
