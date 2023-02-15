import { DEPLOY_HOST } from '../config';

export const getDeployPath = (category: string, path: string) => {
  return `${DEPLOY_HOST}/${category
    .replace(/^\//, '')
    .replace(/\/$/, '')}/${path.replace(/^\//, '').replace(/\/$/, '')}/`;
};
