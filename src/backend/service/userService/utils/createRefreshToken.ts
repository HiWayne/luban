import { getTimeWithMillisecond } from '@duitang/dt-base';
import { UserEntity } from '../types';
import { createJWTToken } from './createJWTToken';

export const createRefreshToken = (data: UserEntity) =>
  createJWTToken(data, getTimeWithMillisecond(1, 'month'));
