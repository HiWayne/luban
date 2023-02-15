import { DEPLOY_PATH } from '../../compileService/config';

export const getDeployPath = (
  category: string,
  path: string,
  absolute?: boolean,
) => {
  const _path = `/${category.replace(/^\//, '').replace(/\/$/, '')}/${path
    .replace(/^\//, '')
    .replace(/\/$/, '')}`;
  return absolute ? `${DEPLOY_PATH}${_path}` : _path;
};
