export const escapeRegex = (s?: string) => {
  return typeof s === 'string'
    ? s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
    : '';
};
