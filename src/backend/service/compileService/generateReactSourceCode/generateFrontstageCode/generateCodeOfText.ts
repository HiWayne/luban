import { NodeAST, TextProps } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';
import {
  actionConfig,
  commonTextConfig,
  heightConfig,
  marginConfig,
  paddingConfig,
  styleConfig,
  ToCComponent,
  widthConfig,
} from './toCComponentsPluginsConfig';

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

  const componentDeclaration = `const ${componentName} = ({ role, id, width, height, italic, text, color, fontSize, fontWeight, fontFamily, lineHeight, textDecoration, margin, padding, backgroundColor, textAlign, onClick, ellipsisStyle = {}, style = {} }) => {
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
        return <i role={role} id={id} style={textStyle} onClick={onClick}>{text}</i>
    } else {
        return <span role={role} id={id} style={textStyle} onClick={onClick}>{text}</span>
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
          `async (event) => {event.stopPropagation();${generateCodeOfAction(action)}}`,
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
    lineHeight,
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

generateCodeOfText.plugin = {
  level: 1,
  sort: 6,
  leaf: true,
  name: '文字',
  type: 'Text',
  description:
    '文字。所有字符只能共用同一套样式。若一段文字中有不同样式，请使用【段落】组件。文字组件内部不能再有子组件。',
  defaultAST: {
    type: 'Text',
    props: {
      text: '文字文字文字',
      fontSize: 14,
      color: '#444444',
      fontWeight: 400,
      fontFamily: 'PingFangSC-Regular, PingFang SC',
    },
  },
  configs: [
    {
      name: '内容',
      description: '文字内容。可以是字符串，也可以是变量',
      required: true,
      propName: 'text',
      formSchema: {
        type: 'text-content',
      },
      defaultConfig: {
        text: '文字文字文字',
      },
    },
    actionConfig,
    marginConfig,
    paddingConfig,
    widthConfig,
    heightConfig,
    ...commonTextConfig,
    {
      name: '是否斜体',
      description: '文字是否是斜体字',
      required: false,
      propName: 'italic',
    },
    {
      name: '背景颜色',
      description: '文字背景颜色',
      required: false,
      propName: 'backgroundColor',
    },
    {
      name: '过长是否省略',
      description:
        '文字组件的宽度默认由文字数量决定。但如果你设置了组件宽度，文字过长会换行。你可以设置该配置，让文字始终单行并且过长省略（结尾省略号）。',
      required: false,
      propName: 'ellipsis',
    },
    actionConfig,
    styleConfig,
  ],
} as ToCComponent;
