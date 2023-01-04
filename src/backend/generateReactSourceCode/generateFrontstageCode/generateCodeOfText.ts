import { NodeAST, TextProps } from '@/backend/types/frontstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfText = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const {
    text,
    color,
    fontSize,
    lineHeight,
    fontWeight,
    italic,
    fontFamily,
    width,
    textDecoration,
    margin,
    padding,
    backgroundColor,
    ellipsis,
    style,
  } = props as TextProps;

  const componentName = 'Text';

  const componentDeclaration = `const ${componentName} = ({ width, italic, text, color, fontSize, fontWeight, fontFamily, lineHeight, textDecoration, margin, padding, backgroundColor, ellipsisStyle = {}, style = {} }) => {
    const textStyle = useMemo(() => ({
        display: 'inline-block',
        width,
        color,
        fontSize,
        fontWeight,
        fontFamily,
        lineHeight,
        textDecoration,
        margin,
        padding,
        backgroundColor,
        ...ellipsisStyle,
        ...style,
    }), [])

    if (italic) {
        return <i style={textStyle}>{text}</i>
    } else {
        return <span style={textStyle}>{text}</span>
    }
  };`;

  const ellipsisStyle = ellipsis
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    : undefined;

  const componentCall = `<${componentName}${generateCodeOfProp(
    'text',
    text,
  )}${generateCodeOfProp('color', color)}${generateCodeOfProp(
    'fontSize',
    fontSize,
  )}${generateCodeOfProp('lineHeight', lineHeight)}${generateCodeOfProp(
    'fontWeight',
    fontWeight,
  )}${generateCodeOfProp('italic', italic)}${generateCodeOfProp(
    'fontFamily',
    fontFamily,
  )}${generateCodeOfProp('width', width)}${generateCodeOfProp(
    'textDecoration',
    textDecoration,
  )}${generateCodeOfProp('margin', margin)}${generateCodeOfProp(
    'padding',
    padding,
  )}${generateCodeOfProp(
    'backgroundColor',
    backgroundColor,
  )}${generateCodeOfProp('ellipsisStyle', ellipsisStyle)}${generateCodeOfProp(
    'style',
    style,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
