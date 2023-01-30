import { decodeJWTToken } from './decodeJWTToken';

export const getUserByToken = async (token: string) => {
  if (typeof token !== 'string' || !token) {
    return Promise.reject({
      status: 400,
      response: { status: 4, data: null, message: '' },
    });
  }
  const data = await decodeJWTToken(token);
  if (data && new Date().getTime() < data.expires) {
    return data.data;
  } else {
    return Promise.reject({
      status: 400,
      response: { status: 4, data: null, message: '' },
    });
  }
};
