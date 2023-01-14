import * as CryptoJS from 'crypto-js';

export const createSalt = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};
