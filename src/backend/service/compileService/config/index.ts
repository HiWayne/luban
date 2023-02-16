import path from 'path';

export const TEMP_FILE_PATH = path.resolve(__dirname, '../../../../_temp');

export const DEPLOY_DIR = 'static';

export const DEPLOY_PATH = path.resolve(
  __dirname,
  `../../../../../../${DEPLOY_DIR}`,
);
