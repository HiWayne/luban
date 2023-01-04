import {
  isVariableName,
  isString,
  isBuiltInFunctionCode,
  isBuiltInVariableCode,
} from './utils';
import { generateCodeOfValue } from './generateBackstageCode/generateCodeOfLiteral';

export const generateCodeOfProp = (propName: string, propValue?: any) =>
  propValue !== undefined
    ? isVariableName(propValue) ||
      !isString(propValue) ||
      isBuiltInFunctionCode(propValue)
      ? isBuiltInFunctionCode(propValue) || isBuiltInVariableCode(propValue)
        ? ` ${propName}={${propValue.code}}`
        : typeof propValue === 'object'
        ? ` ${propName}={${generateCodeOfValue(propValue)}}`
        : typeof propValue === 'boolean'
        ? propValue === true
          ? ` ${propName}={true}`
          : ` ${propName}={false}`
        : ` ${propName}={${propValue}}`
      : ` ${propName}="${propValue}"`
    : '';
