import {
  ACCESS_TOKEN_HEADER,
  REFRESH_TOKEN_HEADER,
} from '@/backend/service/userService/config';

export const clearTokens = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_HEADER);
  window.localStorage.removeItem(REFRESH_TOKEN_HEADER);
  window.sessionStorage.removeItem(ACCESS_TOKEN_HEADER);
  window.sessionStorage.removeItem(REFRESH_TOKEN_HEADER);
};
