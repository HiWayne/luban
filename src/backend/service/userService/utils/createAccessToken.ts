import { getTimeWithMillisecond } from '@duitang/dt-base';
import { UserEntity } from '../types';
import { createJWTToken } from './createJWTToken';

export const createAccessToken = (data: UserEntity) =>
  createJWTToken(data, getTimeWithMillisecond(1, 'minute'));
