import { NodeAST } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfInlineContainer = (nodeAST: NodeAST, id: number) => {
  const componentName = `InlineContainer_${id}`;

  const componentElement = `<InlineContainer>{children}</InlineContainer>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
