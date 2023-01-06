import { NodeAST, TextProps } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';

export const generateCodeOfText = (
  nodeAST: NodeAST,
  id: number,
  context: Context,
) => {
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
    action,
  } = props as TextProps;

  const componentName = 'Text';

  const componentDeclaration = `const ${componentName} = ({ id, width, height, italic, text, color, fontSize, fontWeight, fontFamily, lineHeight, textDecoration, margin, padding, backgroundColor, textAlign, onClick, ellipsisStyle = {}, style = {} }) => {
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
        return <i id={id} style={textStyle} onClick={onClick}>{text}</i>
    } else {
        return <span id={id} style={textStyle} onClick={onClick}>{text}</span>
    }
  };`;

  const ellipsisStyle = ellipsis
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    : undefined;

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
  )}${generateCodeOfProp('text', text)}${generateCodeOfProp(
    'color',
    color,
  )}${generateCodeOfProp('fontSize', fontSize)}${generateCodeOfProp(
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
  )}${generateCodeOfProp('style', style)}${generateCodeOfProp(
    'onClick',
    onClickCode,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
