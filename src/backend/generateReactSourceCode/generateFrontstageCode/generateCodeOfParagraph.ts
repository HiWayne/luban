import { NodeAST, ParagraphProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createGenerateCodeFnReturn,
  createIdAttrInDev,
  isVariableName,
} from '../utils';

export const generateCodeOfParagraph = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props } = nodeAST;
  const {
    texts,
    textAlign,
    textIndent,
    margin,
    padding,
    width,
    height,
    wrap,
    ellipsis,
    color,
    fontSize,
    lineHeight,
    fontWeight,
    fontFamily,
    textDecoration,
  } = props as ParagraphProps;

  const componentName = 'Paragraph';

  const componentDeclaration = `const ${componentName} = ({ id, children, textAlign, textIndent, margin, padding, width, height, wrap, color, fontSize, lineHeight, fontWeight, fontFamily, textDecoration, ellipsisStyle = {} }) => {
    const pStyle = useMemo(() => ({
        margin,
        padding,
        width,
        height,
        textAlign,
        textIndent,
        whiteSpace: wrap ? undefined : 'no-wrap',
        color,
        fontSize,
        lineHeight,
        fontWeight,
        fontFamily,
        textDecoration,
        ...ellipsisStyle,
    }), [margin, padding, width, height, textAlign, textIndent, wrap, color, fontSize, lineHeight, fontWeight, fontFamily, textDecoration, ...Object.values(ellipsisStyle)])

    return (<p id={id} style={pStyle}>{children}</p>)
  };`;

  const ellipsisStyle =
    ellipsis && typeof ellipsis.rows === 'number' && ellipsis.rows > 0
      ? ellipsis.rows === 1
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        : {
            display: '-webkit-box',
            overflow: 'hidden',
            wordBreak: 'break-all',
            textOverflow: 'ellipsis',
            WebkitLineClamp: ellipsis.rows,
            WebkitBoxOrient: 'vertical',
          }
      : undefined;

  const componentCall = `<${componentName}${createIdAttrInDev(
    context.development,
    id,
  )}${generateCodeOfProp('textAlign', textAlign)}${generateCodeOfProp(
    'margin',
    margin,
  )}${generateCodeOfProp('padding', padding)}${generateCodeOfProp(
    'width',
    width,
  )}${generateCodeOfProp('height', height)}${generateCodeOfProp(
    'wrap',
    wrap,
  )}${generateCodeOfProp('ellipsisStyle', ellipsisStyle)}${generateCodeOfProp(
    'textIndent',
    textIndent,
  )}${generateCodeOfProp('color', color)}${generateCodeOfProp(
    'fontSize',
    fontSize,
  )}${generateCodeOfProp(
    'lineHeight',
    typeof lineHeight === 'number' ? `${lineHeight}px` : lineHeight,
  )}${generateCodeOfProp('fontWeight', fontWeight)}${generateCodeOfProp(
    'fontFamily',
    fontFamily,
  )}${generateCodeOfProp('textDecoration', textDecoration)}>${
    Array.isArray(texts)
      ? texts.reduce(
          (childrenCode, text) =>
            typeof text === 'string'
              ? isVariableName(text)
                ? `${childrenCode}{${text}}`
                : `${childrenCode}${text}`
              : `${childrenCode}${astToReactNodeCodeOfFrontstage(
                  text,
                  declarations,
                  context,
                )}`,
          '',
        )
      : ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
