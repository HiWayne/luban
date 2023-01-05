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
    height,
    textDecoration,
    margin,
    padding,
    backgroundColor,
    ellipsis,
    textAlign,
    style,
  } = props as TextProps;

  const componentName = 'Text';

  const componentDeclaration = `const ${componentName} = ({ width, height, italic, text, color, fontSize, fontWeight, fontFamily, lineHeight, textDecoration, margin, padding, backgroundColor, textAlign, ellipsisStyle = {}, style = {} }) => {
    const textStyle = useMemo(() => ({
        display: 'inline-block',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
        width,
        height,
        textAlign,
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
    }), [width, height, color, fontSize, fontWeight, fontFamily, lineHeight, textDecoration, margin, padding, backgroundColor, textAlign, ...Object.values(ellipsisStyle), ...Object.values(style)])

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
  )}${generateCodeOfProp(
    'lineHeight',
    typeof lineHeight === 'number' ? `${lineHeight}px` : lineHeight,
  )}${generateCodeOfProp('fontWeight', fontWeight)}${generateCodeOfProp(
    'italic',
    italic,
  )}${generateCodeOfProp('fontFamily', fontFamily)}${generateCodeOfProp(
    'width',
    width,
  )}${generateCodeOfProp('height', height)}${generateCodeOfProp(
    'textDecoration',
    textDecoration,
  )}${generateCodeOfProp('margin', margin)}${generateCodeOfProp(
    'padding',
    padding,
  )}${generateCodeOfProp(
    'backgroundColor',
    backgroundColor,
  )}${generateCodeOfProp('textAlign', textAlign)}${generateCodeOfProp(
    'ellipsisStyle',
    ellipsisStyle,
  )}${generateCodeOfProp('style', style)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
