import { shallowEqual } from './shallowEqual';

export const objectInclude = (a: any, b: any) => {
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    return Object.entries(b).every(([key, value]) => {
      if (value && typeof value === 'object') {
        if (a[key] && typeof a[key] === 'object') {
          return shallowEqual(a[key], value);
        } else {
          return false;
        }
      } else {
        return a[key] === value;
      }
    });
  } else {
    return false;
  }
};
