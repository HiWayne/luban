import { NodeAST, SpaceProps } from '@/backend/types/backstage';
import { astToReactNodeCodeOfBackstage, Context, Declarations } from '../index';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfSpace = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props, children } = nodeAST;
  const { wrap, align, size, direction } = props as SpaceProps;

  const componentName = `Space_${id}`;

  const componentElement = `<Space${generateCodeOfProp(
    'wrap',
    wrap,
  )}${generateCodeOfProp('align', align)}${generateCodeOfProp(
    'size',
    size,
  )}${generateCodeOfProp('direction', direction)}>${children!.reduce(
    (childrenCode, child) =>
      `${childrenCode}${
        astToReactNodeCodeOfBackstage(child, declarations, context).call
      }`,
    '',
  )}</Space>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
