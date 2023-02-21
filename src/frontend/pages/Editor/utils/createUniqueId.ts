export const idReturnToZero = {
  method: () => {
    console.warn('idReturnToZero warning: 你还没有使用过createUniqueId');
  },
};

export const createUniqueId = (() => {
  let id = 0;
  idReturnToZero.method = () => {
    id = 0;
  };
  return () => {
    return ++id;
  };
})();
