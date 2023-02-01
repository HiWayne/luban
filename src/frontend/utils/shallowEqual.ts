export const shallowEqual = (a: any, b: any) => {
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.entries(b).every(([key, value]) => {
        return a[key] === value;
      })
    );
  } else {
    return a === b;
  }
};
