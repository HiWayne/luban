import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { getTimeWithMillisecond } from '@duitang/dt-base';
import { ALGORITHM_NAME, PRIVATE_KEY_PATH } from '@/backend/config';
import { UserEntity } from '../../templateService/types';

// 生成jwt token
export const createJWTToken = (
  data: UserEntity,
  time = getTimeWithMillisecond(15, 'minute'),
) => {
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, { encoding: 'utf-8' });
  const token = jwt.sign({ data, expires: time }, privateKey.toString(), {
    algorithm: ALGORITHM_NAME,
  });
  return token;
};
