export interface VerifyTypeStructure {
  key: string;
  type: string[];
}

export const STRING = 'STRING';
export const NUMBER = 'NUMBER';
export const ARRAY = 'ARRAY';
export const OBJECT = 'OBJECT';
export const BOOLEAN = 'BOOLEAN';

const originalTypes = [STRING, NUMBER, ARRAY, OBJECT, BOOLEAN];

const verifyType = (data: any, key: string, types: string[]) => {
  if (Array.isArray(types)) {
    return types.some((type) => {
      if (originalTypes.includes(type)) {
        switch (type) {
          case STRING:
            return typeof data[key] === 'string';
          case NUMBER:
            return typeof data[key] === 'number';
          case BOOLEAN:
            return typeof data[key] === 'boolean';
          case ARRAY:
            return Array.isArray(data[key]);
          case OBJECT:
            return (
              data && typeof data[key] === 'object' && !Array.isArray(data[key])
            );
          default:
            throw new Error('type不属于verifyType已有的类型');
        }
      } else {
        return data[key] === type;
      }
    });
  } else {
    throw new Error('VerifyTypeStructure 中的 type 类型不合法');
  }
};

export const verifyValues = (
  data: any,
  requiredValues: VerifyTypeStructure[],
  optionalValues: VerifyTypeStructure[],
) => {
  if (!data) {
    throw new Error('verifyValues 的 data 不能为空');
  }
  if (Array.isArray(requiredValues) && Array.isArray(optionalValues)) {
    const requiredValuesLegal = requiredValues.every(({ key, type }) =>
      verifyType(data, key, type),
    );
    const optionalValuesLegal = optionalValues.every(({ key, type }) => {
      if (data[key] === undefined) {
        return true;
      } else {
        return verifyType(data, key, type);
      }
    });
    return requiredValuesLegal && optionalValuesLegal;
  } else {
    throw new Error(
      'verifyValues 的 requiredValues 和 optionalValues 参数必须是数组',
    );
  }
};
