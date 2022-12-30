import { NodeAST } from '@/backend/types/frontstage';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfBlockContainer = (nodeAST: NodeAST) => {
  const { props } = nodeAST;

  const componentName = 'BlockContainer';

  const componentElement = `<div>{children}</div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
    canHoist: false,
  });
};
