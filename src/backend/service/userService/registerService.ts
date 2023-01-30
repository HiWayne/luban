import { mongoConfig } from '@/backend/config';
import { UserEntity, UserRegisterDTO } from './types';
import { createIdService, getVersionService } from '../userIdService';
import { USER_ID } from '../userIdService/config';
import {
  createSalt,
  decode,
  hash,
  createAccessToken,
  createRefreshToken,
  formatUserResponse,
} from './utils';

export const registerService = async (body: UserRegisterDTO) => {
  try {
    const { name, password, desc, sex, avatar } = body;

    const decodePassword = await decode(password);

    // 生成盐
    const salt = createSalt();

    const passwordHash = hash(decodePassword, salt);

    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    const version = await getVersionService(USER_ID);

    const userId: number = await createIdService({ id: USER_ID, version });

    const currentTimestamp = new Date().getTime();

    const result = await collection.insertOne({
      id: userId,
      name,
      _password: passwordHash,
      _salt: salt,
      desc,
      sex,
      avatar,
      roles: [],
      create_time: currentTimestamp,
      last_login_times: [currentTimestamp],
    });
    if (result.acknowledged) {
      const userData: UserEntity = {
        _id: result.insertedId,
        id: userId,
        name,
        _password: passwordHash,
        _salt: salt,
        desc,
        sex,
        avatar,
        roles: [],
        create_time: currentTimestamp,
        last_login_times: [currentTimestamp],
      };

      const responseUser = formatUserResponse(userData);

      const accessToken = createAccessToken(userData);
      const refreshToken = createRefreshToken(userData);

      return { user: responseUser, accessToken, refreshToken };
    } else {
      throw new Error('用户注册失败');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
