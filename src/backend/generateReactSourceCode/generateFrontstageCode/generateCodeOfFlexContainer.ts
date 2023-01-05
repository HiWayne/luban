import { FlexContainerProps, NodeAST } from '@/backend/types/frontstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfFlexContainer = (
  nodeAST: NodeAST,
  children: string | undefined,
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
  } = props as FlexContainerProps;

  const componentName = 'FlexContainer';

  const componentDeclaration = `const ${componentName} = ({ layout, direction = 'row', justifyContent = 'center', alignItems = 'center', style = {}, children }) => {
    const flexStyle = useMemo(() => ({
        display: layout === 'inline' ? 'inline-flex' : 'flex',
        flexDirection: direction,
        justifyContent,
        alignItems,
        ...style,
    }), [layout, direction, justifyContent, alignItems, ...Object.values(style)])

    return <div style={flexStyle}>{children}</div>
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

  const componentCall = `<${componentName}${generateCodeOfProp(
    'layout',
    layout,
  )}${generateCodeOfProp('direction', direction)}${generateCodeOfProp(
    'justifyContent',
    justifyContent,
  )}${generateCodeOfProp('alignItems', alignItems)}${generateCodeOfProp(
    'style',
    styleObject,
  )}>${children || ''}</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
