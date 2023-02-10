import { BasicContainerProps, NodeAST } from '@/backend/types/frontstage';
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
  commonContainerConfigs,
  ToCComponent,
} from './toCComponentsPluginsConfig';

export const generateCodeOfBasicContainer = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  context: Context,
) => {
  const { props, key } = nodeAST;
  const {
    layout,
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
  } = props as BasicContainerProps;

  const componentName = 'BasicContainer';

  const styleObject = {
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

  Reflect.ownKeys(styleObject).forEach((styleKey: any) => {
    if ((styleObject as any)[styleKey] === undefined) {
      delete (styleObject as any)[styleKey];
    }
  });

  const componentDeclaration = `const ${componentName} = ({ role, id, children, onClick, style = {} }) => (<div role={role} id={id} style={${
    layout === 'inline' ? `{display: 'inline-block', ...style}` : 'style'
  }} onClick={onClick}>{children}</div>);`;

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
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'style',
    styleObject,
  )}${generateCodeOfProp('onClick', onClickCode)}>${
    children || ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

generateCodeOfBasicContainer.plugin = {
  level: 1,
  sort: 1,
  name: '普通容器',
  type: 'BasicContainer',
  description:
    '默认是【块级】容器。块级：内部内容（或容器指定了宽度）不足一行时依然会占满一行。也可将布局设置为【行内】。行内：容器宽度由内部内容撑开、也可以指定容器宽度，多个行内容器，单个宽度不足一行时会在一行排列。【块级】/【行内】容器本身没有内容，里面需要添加内容。',
  defaultAST: {
    type: 'BasicContainer',
    props: {},
    children: [],
  },
  configs: [
    actionConfig,
    ...commonContainerConfigs,
  ],
} as ToCComponent;
