import { NodeAST } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfForm = (nodeAST: NodeAST, id: number) => {
  const componentName = `Form_${id}`;
  const componentElement = `<Form>{children}</Form>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
