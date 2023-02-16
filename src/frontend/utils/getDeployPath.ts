import { ENTRANCE_HOST, PUBLIC_PATH } from '@/backend/config';

export const getDeployPath = (category: string, path: string) => {
  return `${
    ENTRANCE_HOST
      ? PUBLIC_PATH
        ? `https://${ENTRANCE_HOST}${PUBLIC_PATH}`
        : `https://${ENTRANCE_HOST}`
      : ''
  }/${category.replace(/^\//, '').replace(/\/$/, '')}/${path
    .replace(/^\//, '')
    .replace(/\/$/, '')}/`;
};
