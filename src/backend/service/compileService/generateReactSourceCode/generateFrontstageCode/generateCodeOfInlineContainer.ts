import { InlineContainerProps, NodeAST } from '@/backend/types/frontstage';
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
  ToCComponent,
} from './toCComponentsPluginsConfig';

export const generateCodeOfInlineContainer = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  context: Context,
) => {
  const { props, key } = nodeAST;
  const {
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
  } = props as InlineContainerProps;

  const componentName = 'InlineContainer';

  const inlineContainerStyle = {
    width,
    height,
    margin,
    padding,
    borderRadius,
    backgroundColor,
    backgroundSize,
    backgroundImage: backgroundImage
      ? `url(\\'${backgroundImage}\\')`
      : undefined,
    backgroundPosition,
    backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat',
    ...(style || {}),
  };

  const componentDeclaration = `const ${componentName} = ({ role, id, children, onClick, style = {} }) => (<div role={role} id={id} style={{display: 'inline-block', ...style}} onClick={onClick}>{children}</div>);`;

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
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'style',
    inlineContainerStyle,
  )}${generateCodeOfProp('onClick', onClickCode)}>${
    children || ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

generateCodeOfInlineContainer.plugin = {
  sort: 1,
  name: '行内布局容器',
  type: 'InlineContainer',
  description:
    '默认大小由内容大小决定，多个行内容器（单个宽度不足一行时）可以放在一行。本身没有内容，里面需要添加内容。',
  defaultAST: {
    type: 'InlineContainer',
    props: {},
    children: [],
  },
  configs: [...commonContainerConfigs],
} as ToCComponent;
