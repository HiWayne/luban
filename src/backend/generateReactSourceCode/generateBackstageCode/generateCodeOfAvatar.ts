import { AvatarProps, NodeAST } from '@/backend/types/backstage';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';

export const generateCodeOfAvatar = (nodeAST: NodeAST, id: number) => {
  const { props } = nodeAST;

  const { alt, gap, shape, size, src, crossOrigin, fallback } =
    props as AvatarProps;

  const componentName = `Avatar_${id}`;

  const componentElement = `<Avatar${generateCodeOfProp(
    'alt',
    alt,
  )}${generateCodeOfProp('gap', gap)}${generateCodeOfProp(
    'shape',
    shape,
  )}${generateCodeOfProp(
    'size',
    typeof size === 'object' ? generateCodeOfLiteral(size) : size,
  )}${generateCodeOfProp('src', src)}${generateCodeOfProp(
    'crossOrigin',
    crossOrigin,
  )}${fallback ? `fallback={<img src="${fallback}" />}` : ''} />`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
