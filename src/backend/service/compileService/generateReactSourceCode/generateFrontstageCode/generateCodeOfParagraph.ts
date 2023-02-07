import { NodeAST, ParagraphProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createGenerateCodeFnReturn,
  createIdAttrInDev,
  isVariableName,
} from '../utils';
import {
  commonTextConfig,
  heightConfig,
  marginConfig,
  paddingConfig,
  ToCComponent,
  widthConfig,
} from './toCComponentsPluginsConfig';

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
    ellipsis,
    color,
    fontSize,
    lineHeight,
    fontWeight,
    fontFamily,
    textDecoration,
  } = props as ParagraphProps;

  const componentName = 'Paragraph';

  const componentDeclaration = `const ${componentName} = ({ role, id, children, textAlign, textIndent, margin, padding, width, height, color, fontSize, lineHeight, fontWeight, fontFamily, textDecoration, ellipsisStyle = {} }) => {
    const pStyle = useMemo(() => ({
        margin,
        padding,
        width,
        height,
        textAlign,
        textIndent,
        color,
        fontSize,
        lineHeight,
        fontWeight,
        fontFamily,
        textDecoration,
        ...ellipsisStyle,
    }), [margin, padding, width, height, textAlign, textIndent, color, fontSize, lineHeight, fontWeight, fontFamily, textDecoration, ...Object.values(ellipsisStyle)])

    return (<p role={role} id={id} style={pStyle}>{children}</p>)
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
  )}${generateCodeOfProp(
    'textAlign',
    textAlign ? `${textAlign}em` : undefined,
  )}${generateCodeOfProp('margin', margin)}${generateCodeOfProp(
    'padding',
    padding,
  )}${generateCodeOfProp('width', width)}${generateCodeOfProp(
    'height',
    height,
  )}${generateCodeOfProp('ellipsisStyle', ellipsisStyle)}${generateCodeOfProp(
    'textIndent',
    textIndent,
  )}${generateCodeOfProp('color', color)}${generateCodeOfProp(
    'fontSize',
    fontSize,
  )}${generateCodeOfProp('lineHeight', lineHeight)}${generateCodeOfProp(
    'fontWeight',
    fontWeight,
  )}${generateCodeOfProp('fontFamily', fontFamily)}${generateCodeOfProp(
    'textDecoration',
    textDecoration,
  )}>${
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

generateCodeOfParagraph.plugin = {
  level: 1,
  sort: 7,
  name: '段落',
  type: 'Paragraph',
  description: '一段文字，由多个文字组件组成',
  defaultAST: {
    type: 'Paragraph',
    props: {
      texts: ['段落段落段落'],
      fontSize: 14,
      color: '#444444',
      fontWeight: 400,
      fontFamily: 'PingFangSC-Regular, PingFang SC',
    },
  },
  configs: [
    {
      name: '内容',
      description:
        '内容可以由多个文字组件组成，文字组件里的文字样式是文字组件的样式，通过这种方式可以给一段中的某几个字单独设置颜色、背景等。内容也可以直接是字符串，字符串的文字样式就是段落的样式',
      required: true,
      propName: 'texts',
    },
    marginConfig,
    paddingConfig,
    widthConfig,
    heightConfig,
    {
      name: '首行缩进',
      description:
        '设置首行缩进的文字数。默认不缩进，如果设置2代表首行缩进2个字符长度。',
      required: false,
      propName: 'textIndent',
    },
    ...commonTextConfig,
    {
      name: '过长是否省略',
      description:
        '段落宽度默认占满整行。如果你设置了组件宽度，你可以设置该配置，如果文字超过n行后省略（结尾省略号）。',
      required: false,
      propName: 'ellipsis',
    },
  ],
} as ToCComponent;
