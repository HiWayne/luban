import { isVariableName } from './isVariableName';

/** 
 * value可能是xxx.xxx或xxx["xxx"]这样的成员变量，返回成员变量的路径修改
 * 例如："object.a.b" => ".a.b"
*/
export const getMemberVariablePath = (value: string) => {
  const propertyStartIndex = isVariableName(value)
    ? value!.indexOf('.') !== -1
      ? value!.indexOf('.')
      : value!.indexOf('[') !== -1
      ? value!.indexOf('[')
      : -1
    : -1;

  return propertyStartIndex === -1 ? '' : value.slice(propertyStartIndex);
};
