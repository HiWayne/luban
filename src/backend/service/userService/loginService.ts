import { getTimeWithMillisecond } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { LoginInDTO } from '../templateService/types';
import { createJWTToken, decode, formatUserResponse, hash } from './utils';

export const loginService = async (body: LoginInDTO) => {
  try {
    const { userName, password } = body;
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);
    const user = collection.findOne({ name: userName });
    if (user) {
      const passwordHash = hash(decode(password), user._salt);
      if (passwordHash === user._password) {
        const userData = {
          id: user.id,
          name: user.name,
          _password: user._password,
          _salt: user._salt,
          desc: user.desc,
          sex: user.sex,
          avatar: user.avatar,
          roles: user.roles,
          create_time: user.create_time,
        };

        const responseUser = formatUserResponse(user);

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
        throw new Error('账号或密码错误');
      }
    } else {
      throw new Error('账号或密码错误');
    }
  } catch (e) {
    return Promise.reject(`${e}`);
  }
};
