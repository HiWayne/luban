import { BlockContainerProps, NodeAST } from '@/backend/types/frontstage';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';
import { commonContainerConfigs, ToCComponent } from './toCComponentsPluginsConfig';

export const generateCodeOfBlockContainer = (
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
  } = (props as BlockContainerProps) || {};

  const componentName = 'BlockContainer';

  const blockContainerStyle = {
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

  const onClickCode =
    !context.development && action
      ? createBuiltInTypeCode(
          'function',
          `async () => {${generateCodeOfAction(action)}}`,
        )
      : undefined;

  const componentCall = `<div${createIdAttrInDev(
    context.development,
    id,
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'style',
    blockContainerStyle,
  )}${generateCodeOfProp('onClick', onClickCode)}>${children || ''}</div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentCall,
    canHoist: false,
  });
};

generateCodeOfBlockContainer.plugin = {
  level: 1,
  sort: 0,
  name: '块级布局容器',
  type: 'BlockContainer',
  description:
    '默认占满一行的容器，哪怕实际宽度不足一行，后面的内容依然会另起一行。本身没有内容，里面需要添加内容。',
  defaultAST: {
    type: 'BlockContainer',
    props: {},
    children: [],
  },
  configs: [...commonContainerConfigs],
} as ToCComponent;
