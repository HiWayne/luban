import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { ALGORITHM_NAME, PRIVATE_KEY_PATH } from '@/backend/config';
import { UserEntity } from '../types';

export const decodeJWTToken = async (
  token: string,
): Promise<{ data: UserEntity; expires: number } | null> => {
  if (!token) {
    return null;
  }
  try {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);
    return await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        privateKey.toString('base64'),
        {
          algorithms: [ALGORITHM_NAME],
        },
        (err, decoded) => {
          if (!err) {
            resolve(decoded as any);
          } else {
            reject(err);
          }
        },
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
