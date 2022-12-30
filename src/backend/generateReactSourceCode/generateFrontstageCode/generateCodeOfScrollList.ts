import { NodeAST } from '@/backend/types/frontstage';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfScrollList = (nodeAST: NodeAST) => {
  const { props } = nodeAST;

  const componentName = `ScrollList`;

  // TODO:水平滚动列表
  const componentDeclaration = `const ${componentName} = () => {
    return (<div />)
};`;

  const componentCall = `<${componentName} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
