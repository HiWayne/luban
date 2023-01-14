import * as CryptoJS from 'crypto-js';

export const hash = (password: string, salt: string, count = 1000) => {
  const key512Bits = CryptoJS.PBKDF2(password, salt, {
    hasher: CryptoJS.algo.SHA512,
    keySize: 512 / 32,
    iterations: count,
  });
  const passwordHash = key512Bits.toString(CryptoJS.enc.Hex);
  return passwordHash;
};
