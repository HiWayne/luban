import { isValidPath, hasSubPath } from './others';

export const isLikeObject = (target: any) => target && typeof target === 'object';

export const readValueByPath = <T>(target: any, path?: MaybeHasSubPath): T[] | undefined => {
  if (isValidPath(path)) {
    const readValue = (path: Path): T =>
      path.reduce((value, key) => {
        if (isLikeObject(value)) {
          const readedValue = value[key];
          return readedValue;
        } else {
          return value;
        }
      }, target);
    if (hasSubPath(path)) {
      return (path as Path[])?.map((subPath) => readValue(subPath));
    } else {
      return [readValue(path as Path)];
    }
  }
};

export const modifyValueByPath = (target: any, path?: MaybeHasSubPath, newValue?: any): boolean => {
  if (isValidPath(path)) {
    const modifyValue = (path: Path): boolean =>
      path.reduce((value, key, index) => {
        if (isLikeObject(value)) {
          if (index === path.length - 1) {
            value[key] = newValue;
            return true;
          }
          const readedValue = value[key];
          if (isLikeObject(readedValue)) {
            return readedValue;
          }
        }
        return false;
      }, target);
    return hasSubPath(path) ? (path as Path[]).some((subPath) => !!modifyValue(subPath)) : modifyValue(path as Path);
  } else {
    return false;
  }
};
