import { FastifyRequest } from 'fastify';
import { UserEntity } from './types';
import { ACCESS_TOKEN_HEADER } from './config';
import { getUserByToken } from './utils';

export const getUserIdFromHeaderService = async (req: FastifyRequest) => {
  try {
    const accessToken = req.headers[ACCESS_TOKEN_HEADER] as string;
    const userData: UserEntity = await getUserByToken(accessToken);
    return { _id: userData._id, id: userData.id };
  } catch (e) {
    if (e instanceof Error) {
      return Promise.reject(e);
    } else {
      return Promise.reject(e);
    }
  }
};
