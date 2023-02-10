import { isVariableName, isString } from '../utils';

const generateProperty = (key: string, value: any) =>
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  `${key}: ${generateCodeOfValue(value)}`;

export const generateCodeOfValue = (iterate: any) =>
  iterate === undefined || iterate === null
    ? iterate === undefined
      ? 'undefined'
      : 'null'
    : isVariableName(iterate) || !isString(iterate)
    ? typeof iterate === 'object'
      ? // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
        generateCodeOfLiteral(iterate)
      : typeof iterate === 'boolean'
      ? iterate === true
        ? 'true'
        : 'false'
      : iterate
    : `'${iterate}'`;

export const generateCodeOfLiteral = (input: any): string => {
  if (Array.isArray(input)) {
    return `[${input.reduce(
      (code, item, index) =>
        `${code}${
          index === 0
            ? generateCodeOfValue(item)
            : `, ${generateCodeOfValue(item)}`
        }`,
      '',
    )}]`;
  } else if (input && typeof input === 'object') {
    const entries = Object.entries(input);
    return `{ ${entries.reduce((code, [key, value], index): string => {
      if (index === 0) {
        return generateProperty(key, value);
      } else {
        return `${code}, ${generateProperty(key, value)}`;
      }
    }, '')} }`;
  } else if (typeof input === 'string') {
    return `'${input}'`;
  } else if (typeof input === 'boolean') {
    if (input === true) {
      return 'true';
    } else {
      return 'false';
    }
  } else {
    return input;
  }
};
