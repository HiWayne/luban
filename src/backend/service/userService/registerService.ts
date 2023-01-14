import { getTimeWithMillisecond } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { UserRegisterDTO } from '../templateService/types';
import { createUserIdService } from '../userIdService';
import { createSalt, createJWTToken, decode, hash } from './utils';

export const registerService = async (body: UserRegisterDTO) => {
  try {
    const { name, password, desc, sex, avatar } = body;

    const decodePassword = decode(password);

    // 生成盐
    const salt = createSalt();

    const passwordHash = hash(decodePassword, salt);

    const mongodb = process.dbContext.mongo;
    const session = mongodb.startSession();
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    let userId: number | null = null;

    const currentTimestamp = new Date().getTime();

    try {
      await session.withTransaction(async () => {
        const uniqueId = await createUserIdService(session);
        await collection.insertOne({
          id: uniqueId,
          name,
          _password: passwordHash,
          _salt: salt,
          desc,
          sex,
          avatar,
          roles: [],
          create_time: currentTimestamp,
        });
        userId = uniqueId;
      });
    } finally {
      await session.endSession();
    }
    if (userId !== null) {
      const userData = {
        id: userId as number,
        name,
        _password: passwordHash,
        _salt: salt,
        desc,
        sex,
        avatar,
        roles: [],
        create_time: currentTimestamp,
      };

      const responseUser = {
        id: userId as number,
        name,
        desc,
        sex,
        avatar,
        roles: [],
        create_time: currentTimestamp,
      };

      const accessToken = createJWTToken(
        userData,
        getTimeWithMillisecond(15, 'minute'),
      );
      const refreshToken = createJWTToken(
        userData,
        getTimeWithMillisecond(1, 'month'),
      );
      return { user: responseUser, accessToken, refreshToken };
    } else {
      throw new Error('注册用户失败');
    }
  } catch (e) {
    return Promise.reject(`${e}`);
  }
};
