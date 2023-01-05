import { NodeAST, ParagraphProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfParagraph = (
  nodeAST: NodeAST,
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
  } = props as ParagraphProps;

  const componentName = 'Paragraph';

  const componentDeclaration = `const ${componentName} = ({ children, textAlign, textIndent, margin, padding, width, height, wrap, ellipsisStyle = {} }) => {
    const pStyle = useMemo(() => ({
        margin,
        padding,
        width,
        height,
        textAlign,
        textIndent,
        whiteSpace: wrap ? undefined : 'no-wrap',
        ...ellipsisStyle,
    }), [margin, padding, width, height, textAlign, textIndent, wrap, ...Object.values(ellipsisStyle)])

    return (<p style={pStyle}>{children}</p>)
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

  const componentCall = `<${componentName}${generateCodeOfProp(
    'textAlign',
    textAlign,
  )}${generateCodeOfProp('margin', margin)}${generateCodeOfProp(
    'padding',
    padding,
  )}${generateCodeOfProp('width', width)}${generateCodeOfProp(
    'height',
    height,
  )}${generateCodeOfProp('wrap', wrap)}${generateCodeOfProp(
    'ellipsisStyle',
    ellipsisStyle,
  )}${generateCodeOfProp('textIndent', textIndent)}>${
    Array.isArray(texts)
      ? texts.reduce(
          (childrenCode, textNode) =>
            `${childrenCode}${astToReactNodeCodeOfFrontstage(
              textNode,
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
