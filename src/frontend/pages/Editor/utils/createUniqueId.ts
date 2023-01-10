export const createUniqueId = (() => {
  let id = 0;
  return () => {
    return ++id;
  };
})();
