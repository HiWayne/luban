export const isPromise = (data: any) =>
  data instanceof Promise ||
  (typeof (data as any).then === 'function' &&
    typeof (data as any).catch === 'function' &&
    typeof (data as any).finally === 'function');
