import { FastifyRequest } from 'fastify';
import { REFRESH_TOKEN_HEADER } from './config';
import { createAccessToken, decodeJWTToken } from './utils';

export const refreshTokenService = async (req: FastifyRequest) => {
  try {
    const refreshToken = req.headers[REFRESH_TOKEN_HEADER] as string;
    const data = await decodeJWTToken(refreshToken);
    if (data && new Date().getTime() < data.expires) {
      const accessToken = createAccessToken(data.data);
      return accessToken;
    } else {
      throw new Error('用户未登录或登录已过期');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
