import { FlexContainerProps, NodeAST } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';
import {
  commonContainerConfigs,
  layoutConfig,
  ToCComponent,
} from './toCComponentsPluginsConfig';

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

  const componentDeclaration = `const ${componentName} = ({ role, id, layout, direction = 'row', justifyContent = 'center', alignItems = 'center', style = {}, onClick, children }) => {
    const flexStyle = useMemo(() => ({
        display: layout === 'inline' ? 'inline-flex' : 'flex',
        flexDirection: direction,
        justifyContent,
        alignItems,
        ...style,
    }), [layout, direction, justifyContent, alignItems, ...Object.values(style)])

    return <div role={role} id={id} style={flexStyle} onClick={onClick}>{children}</div>
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

generateCodeOfFlexContainer.plugin = {
  sort: 2,
  name: 'Flex布局容器',
  type: 'FlexContainer',
  description:
    '可以控制内容按水平或垂直方向排列，以及它们的对齐位置。本身没有内容，里面需要添加内容。',
  defaultAST: {
    type: 'FlexContainer',
    props: {
      layout: 'block',
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    children: [],
  },
  configs: [
    layoutConfig,
    {
      name: '排列方向',
      description: '内部内容的排列方向。"row"-水平排列、"column"-垂直排列。',
      required: false,
      propName: 'direction',
      formSchema: {
        type: 'select',
        options: [
          {
            label: '水平',
            value: 'row',
          },
          {
            label: '竖直',
            value: 'column',
          },
        ],
      },
      defaultConfig: 'row',
    },
    {
      name: '主轴对齐方式',
      description:
        '比如容器内部水平排列，这个配置影响的就是内容在水平方向上的对齐方式。"flex-start"-开始方向、"flex-end"-结束方向、"center"-居中、"space-between"-两边的内容紧靠两边，中间内容均等间隔、"space-around"-所有内容之间均有间隔。',
      required: false,
      propName: 'justifyContent',
      formSchema: {
        type: 'select',
        options: [
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '沿开始',
            value: 'flex-start',
          },
          {
            label: '沿结束',
            value: 'flex-end',
          },
          {
            label: '靠两边',
            value: 'space-between',
          },
          {
            label: '均等间隔',
            value: 'space-around',
          },
        ],
      },
    },
    {
      name: '交叉轴对齐方式',
      description:
        '比如容器内部水平排列，这个配置影响的就是内容在垂直方向上的对齐方式。"flex-start"-开始方向、"flex-end"-结束方向、"center"-居中、"space-between"-两边的内容紧靠两边，中间内容均等间隔、"space-around"-所有内容之间均有间隔。',
      required: false,
      propName: 'alignItems',
      formSchema: {
        type: 'select',
        options: [
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '沿开始',
            value: 'flex-start',
          },
          {
            label: '沿结束',
            value: 'flex-end',
          },
          {
            label: '靠两边',
            value: 'space-between',
          },
          {
            label: '均等间隔',
            value: 'space-around',
          },
        ],
      },
    },
    ...commonContainerConfigs,
  ],
} as ToCComponent;
