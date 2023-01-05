import { InlineContainerProps, NodeAST } from '@/backend/types/frontstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfInlineContainer = (
  nodeAST: NodeAST,
  children: string | undefined,
) => {
  const { props, key } = nodeAST;
  const {
    width,
    height,
    margin,
    padding,
    backgroundColor,
    backgroundSize,
    backgroundImage,
    backgroundPosition,
    backgroundRepeat,
    borderRadius,
    style,
  } = props as InlineContainerProps;

  const componentName = 'InlineContainer';

  const inlineContainerStyle = {
    width,
    height,
    margin,
    padding,
    borderRadius,
    backgroundColor,
    backgroundSize,
    backgroundImage: backgroundImage
      ? `url(\\'${backgroundImage}\\')`
      : undefined,
    backgroundPosition,
    backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat',
    ...(style || {}),
  };

  const componentDeclaration = `const ${componentName} = ({ children, style = {} }) => (<div style={{display: 'inline-block', ...style}}>{children}</div>);`;

  const componentCall = `<${componentName}${generateCodeOfProp(
    'key',
    key,
  )}${generateCodeOfProp('style', inlineContainerStyle)}>${
    children || ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
