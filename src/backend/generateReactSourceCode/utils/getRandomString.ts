export const getRandomString = () =>
  Number(Math.random().toFixed(18).slice(2)).toString(36);
