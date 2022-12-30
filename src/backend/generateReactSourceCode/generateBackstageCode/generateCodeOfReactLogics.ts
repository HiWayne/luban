import { LogicAST } from '@/backend/types';

export const generateCodeOfReactLogics = (logics?: LogicAST[]) => {
  return Array.isArray(logics)
    ? `${logics.reduce((logicCode, logic) => {
        return `${logicCode}${logic.raw}${/;$/.test(logic.raw) ? '' : ';'}\n`;
      }, '')}`
    : '';
};
