import { NodeAST } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfBlockContainer = (nodeAST: NodeAST, id: number) => {
  const componentName = `BlockContainer_${id}`;
  const componentElement = `<div>{children}</div>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
