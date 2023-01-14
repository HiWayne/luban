import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { ALGORITHM_NAME, PRIVATE_KEY_PATH } from '@/backend/config';

export const decodeToken = (token: string) => {
  if (!token) {
    return null;
  }
  try {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);
    const decoded = jwt.decode(token, privateKey.toString('base64'), {
      algorithms: ALGORITHM_NAME,
    });
    return decoded;
  } catch {
    return null;
  }
};
