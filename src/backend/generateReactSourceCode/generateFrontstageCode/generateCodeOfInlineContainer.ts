import { InlineContainerProps, NodeAST } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';

export const generateCodeOfInlineContainer = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  context: Context,
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
    action,
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

  const componentDeclaration = `const ${componentName} = ({ id, children, onClick, style = {} }) => (<div id={id} style={{display: 'inline-block', ...style}} onClick={onClick}>{children}</div>);`;

  const onClickCode =
    !context.development && action
      ? createBuiltInTypeCode(
          'function',
          `async () => {${generateCodeOfAction(action)}}`,
        )
      : undefined;

  const componentCall = `<${componentName}${createIdAttrInDev(
    context.development,
    id,
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'style',
    inlineContainerStyle,
  )}${generateCodeOfProp('onClick', onClickCode)}>${
    children || ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
