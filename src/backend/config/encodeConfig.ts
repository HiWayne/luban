import path from 'path';

// jwt非对称算法名称
export const ALGORITHM_NAME = 'HS512';

// 非对称加密密钥存放路径
export const PRIVATE_KEY_PATH = path.resolve(
  '../../asymmetricEncryptionKeys/private.key',
);
export const PUBLIC_KEY_PATH = path.resolve(
  '../../asymmetricEncryptionKeys/public.key',
);
