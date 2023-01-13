import { Env } from '@/backend/types';

export const whichEnv = (env: Env, partialEnv: Partial<Env>) => {
  if (!Array.isArray(partialEnv) || partialEnv.length === 0) {
    return true;
  }
  const _partialEnv = [...partialEnv];
  for (let i = 0; i < env.length; i++) {
    const index = _partialEnv.indexOf(env[i]);
    if (index !== -1) {
      _partialEnv.splice(index, 1);
      if (_partialEnv.length === 0) {
        return true;
      }
    }
  }
  return false;
};
