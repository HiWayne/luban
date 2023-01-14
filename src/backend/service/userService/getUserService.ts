import { FastifyRequest } from 'fastify';
import { isExist } from '@duitang/dt-base';
import { mongoConfig } from '@/backend/config';
import { ACCESS_TOKEN_HEADER } from './config';
import { decodeToken, formatUserResponse } from './utils';

export const getUserService = async (req: FastifyRequest, id?: number) => {
  try {
    const mongodb = process.dbContext.mongo;
    const db = mongodb.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.userCollectionName);

    let userId: number = 0;

    if (isExist(id)) {
      userId = id as number;
    } else {
      const accessToken: string = req.headers[ACCESS_TOKEN_HEADER] as any;
      const data = decodeToken(accessToken);
      if (data && new Date().getTime() < data.expires) {
        userId = data.data.id;
      } else {
        return null;
      }
    }
    const user = await collection.findOne({ id: userId });
    if (user) {
      const responseUser = formatUserResponse(user);
      return responseUser;
    } else {
      throw new Error('用户不存在');
    }
  } catch (e) {
    return Promise.reject(`${e}`);
  }
};
