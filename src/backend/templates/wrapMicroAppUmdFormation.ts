export const wrapMicroAppUmdFormation = (code: string, key: string) => {
  return `
  
  !(function (e, o) {
    "object" == typeof exports && "object" == typeof module
    ? (o(module.exports))
    : "function" == typeof define && define.amd
    ? define([], o)
    : "object" == typeof exports
    ? (o(exports["luban-app-${key}"]))
    : (o(e["luban-app-${key}"] = {}));
  })(window, function (__exports) {
    return (() => {
      ${code}
    })();
  });
    `;
};
