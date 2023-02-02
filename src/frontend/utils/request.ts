import { notification } from 'antd';
import {
  ACCESS_TOKEN_HEADER,
  REFRESH_TOKEN_HEADER,
} from '@/backend/service/userService/config';

const getItemFromStorage = (key: string) =>
  window.localStorage.getItem(key) || window.sessionStorage.getItem(key);

export interface RequestConfig {
  useToken?: boolean;
  saveToken?: boolean;
  successNotify?: boolean;
  errorNotify?: boolean;
}

interface Response<T> {
  status: 0 | 1 | 4;
  data: T;
  message: string;
}

/**
 * @description 请求函数，自动保存、携带登录凭证，登录失效自动续期
 * @param {string} url 请求地址
 * @param {RequestInit} fetchOption fetch option
 * @param {boolean} useToken 是否带上登录凭证，默认true
 * @returns
 */
export const request = <T = any>(
  url: RequestInfo | URL,
  fetchOption: RequestInit = {},
  config?: RequestConfig,
) => {
  const {
    useToken = true,
    saveToken = true,
    successNotify = false,
    errorNotify = true,
  } = config || {};
  const accessTokenInStorage = getItemFromStorage(ACCESS_TOKEN_HEADER);
  const extraHeader =
    useToken && accessTokenInStorage
      ? {
          [ACCESS_TOKEN_HEADER]: accessTokenInStorage,
        }
      : null;
  return fetch(
    url,
    extraHeader
      ? fetchOption
        ? {
            ...fetchOption,
            headers: { ...fetchOption.headers, ...extraHeader },
          }
        : fetchOption
      : fetchOption,
  )
    .then((response) => {
      const headers = response.headers;
      const refreshToken = headers.get(REFRESH_TOKEN_HEADER);
      const accessToken = headers.get(ACCESS_TOKEN_HEADER);
      const jsonData = response.json();
      if (refreshToken && accessToken) {
        if (saveToken) {
          window.localStorage.setItem(REFRESH_TOKEN_HEADER, refreshToken);
          window.localStorage.setItem(ACCESS_TOKEN_HEADER, accessToken);
        } else {
          window.sessionStorage.setItem(REFRESH_TOKEN_HEADER, refreshToken);
          window.sessionStorage.setItem(ACCESS_TOKEN_HEADER, accessToken);
        }
      }
      return jsonData;
    })
    .catch((data) => {
      if (errorNotify) {
        notification.error({
          message: '请求发生错误',
          description: data.message,
        });
      }
      return Promise.reject(data);
    })
    .then((data: Response<T>) => {
      if (data.status === 1) {
        if (successNotify) {
          notification.success({
            message: '操作成功',
          });
        }
        return data;
      } else if (data.status === 4) {
        const refreshToken = getItemFromStorage(REFRESH_TOKEN_HEADER);
        if (refreshToken) {
          return fetch('/api/refresh/accessToken/', {
            headers: { [REFRESH_TOKEN_HEADER]: refreshToken },
          }).then((response): Promise<Response<T>> => {
            const token = response.headers.get(ACCESS_TOKEN_HEADER);
            if (token) {
              if (saveToken) {
                window.localStorage.setItem(ACCESS_TOKEN_HEADER, token);
              } else {
                window.sessionStorage.setItem(ACCESS_TOKEN_HEADER, token);
              }
              const headers = { [ACCESS_TOKEN_HEADER]: token };
              return request(
                url,
                fetchOption
                  ? {
                      ...fetchOption,
                      headers: fetchOption.headers
                        ? { ...fetchOption.headers, ...headers }
                        : headers,
                    }
                  : { headers },
              );
            } else {
              if (errorNotify) {
                notification.error({
                  message: '需要登录',
                });
              }
              return Promise.reject(data);
            }
          });
        } else {
          if (errorNotify) {
            notification.error({
              message: '需要登录',
            });
          }
          return Promise.reject(data);
        }
      } else {
        if (errorNotify) {
          notification.error({
            message: '请求发生错误',
            description: data.message,
          });
        }
        return Promise.reject(data);
      }
    });
};
