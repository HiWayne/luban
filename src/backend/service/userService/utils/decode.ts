import fs from 'fs';
import JSEncrypt from 'JSEncrypt';
import { PRIVATE_KEY_PATH } from '@/backend/config';

export const decode = (value: string) => {
  const jSEncrypt = new JSEncrypt();
  // 公钥 setPublicKey。密钥必须是这种格式setKey('-----BEGIN PRIVATE KEY-----MIICdFCQBj...中间省略...D3t4NbK1bqMA=-----END PRIVATE KEY-----')
  jSEncrypt.setPrivateKey(
    fs.readFileSync(PRIVATE_KEY_PATH, { encoding: 'utf-8' }),
  );
  const dec = jSEncrypt.decrypt(value);
  if (!dec) {
    throw new Error('decode失败');
  } else {
    return dec;
  }
};
