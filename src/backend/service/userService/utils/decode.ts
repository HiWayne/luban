import fs from 'fs';
import NodeRSA from 'node-rsa';
import { PRIVATE_KEY_PATH } from '@/backend/config';

export const decode = async (value: string) => {
  const key = fs.readFileSync(PRIVATE_KEY_PATH, { encoding: 'utf-8' });
  const privateKey = new NodeRSA(key);
  // 加密方式和客户端保持一致
  privateKey.setOptions({ encryptionScheme: 'pkcs1' });
  const dec = privateKey.decrypt(atob(value), 'utf8');
  return dec;
};
