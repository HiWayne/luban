import { FlexContainerProps, NodeAST } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';

export const generateCodeOfFlexContainer = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  context: Context,
) => {
  const { props } = nodeAST;
  const {
    layout,
    direction,
    justifyContent,
    alignItems,
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
  } = props as FlexContainerProps;

  const componentName = 'FlexContainer';

  const componentDeclaration = `const ${componentName} = ({ id, layout, direction = 'row', justifyContent = 'center', alignItems = 'center', style = {}, onClick, children }) => {
    const flexStyle = useMemo(() => ({
        display: layout === 'inline' ? 'inline-flex' : 'flex',
        flexDirection: direction,
        justifyContent,
        alignItems,
        ...style,
    }), [layout, direction, justifyContent, alignItems, ...Object.values(style)])

    return <div id={id} style={flexStyle} onClick={onClick}>{children}</div>
  };`;

  const styleObject = {
    width,
    height,
    margin,
    padding,
    backgroundColor,
    backgroundSize,
    backgroundImage: backgroundImage
      ? `url(\\'${backgroundImage}\\')`
      : undefined,
    backgroundPosition,
    backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat',
    borderRadius,
    ...(style || {}),
  };

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
  )}${generateCodeOfProp('layout', layout)}${generateCodeOfProp(
    'direction',
    direction,
  )}${generateCodeOfProp('justifyContent', justifyContent)}${generateCodeOfProp(
    'alignItems',
    alignItems,
  )}${generateCodeOfProp('style', styleObject)}${generateCodeOfProp(
    'onClick',
    onClickCode,
  )}>${children || ''}</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
