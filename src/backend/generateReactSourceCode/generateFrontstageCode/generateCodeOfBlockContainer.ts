import { BlockContainerProps, NodeAST } from '@/backend/types/frontstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfBlockContainer = (
  nodeAST: NodeAST,
  children: string | undefined,
) => {
  const { props, key } = nodeAST;

  const {
    width,
    height,
    margin,
    padding,
    backgroundColor,
    backgroundFit,
    backgroundImage,
    backgroundPosition,
    backgroundRepeat,
    borderRadius,
    style,
  } = props as BlockContainerProps;

  const componentName = 'BlockContainer';

  const blockContainerStyle = {
    width,
    height,
    margin,
    padding,
    borderRadius,
    backgroundColor,
    backgroundFit,
    backgroundImage,
    backgroundPosition,
    backgroundRepeat,
    ...(style || {}),
  };

  const componentCall = `<div${generateCodeOfProp(
    'key',
    key,
  )}${generateCodeOfProp('style', blockContainerStyle)}>${
    children || ''
  }</div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentCall,
    canHoist: false,
  });
};
