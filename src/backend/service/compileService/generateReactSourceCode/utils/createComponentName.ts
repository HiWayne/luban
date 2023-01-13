export const createComponentName = (name: string) =>
  /^[A-Z]/.test(name) ? name : `${name[0].toUpperCase()}${name.slice(1)}`;
