import { ListProps, NodeAST } from '@/backend/types/backstage';
import { astToReactNodeCodeOfBackstage, Context, Declarations } from '../index';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfList = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props } = nodeAST;
  const {
    dataSource,
    bordered,
    footer,
    header,
    itemLayout,
    emptyText,
    renderItem,
    rowKey,
    size,
    split,
  } = props as ListProps;

  const footerElement = footer
    ? astToReactNodeCodeOfBackstage(footer, declarations, context).call
    : undefined;

  const headerElement = header
    ? astToReactNodeCodeOfBackstage(header, declarations, context).call
    : undefined;

  const renderItemCode = {
    _builtInType: 'function',
    code: `(iterate_scope_variable_${
      renderItem.iterate_scope_variable
    }) => ${
      astToReactNodeCodeOfBackstage(renderItem.render, declarations, context)
        .call
    }`,
  };

  const componentName = `List_${id}`;

  const componentElement = `<List${generateCodeOfProp(
    'dataSource',
    dataSource,
  )}${generateCodeOfProp('bordered', bordered)}${generateCodeOfProp(
    'footer',
    footerElement,
  )}${generateCodeOfProp('header', headerElement)}${generateCodeOfProp(
    'itemLayout',
    itemLayout,
  )}
  ${generateCodeOfProp(
    'locale',
    emptyText ? { emptyText } : undefined,
  )}${generateCodeOfProp('renderItem', renderItemCode)}${generateCodeOfProp(
    'rowKey',
    rowKey,
  )}${generateCodeOfProp('size', size)}${generateCodeOfProp(
    'split',
    split,
  )} />`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
