import { NodeAST, ScrollListProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn, _BUILT_IN_TYPE } from '../utils';

export const generateCodeOfScrollList = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props, key } = nodeAST;

  const { data, renderItem, wrapperStyle, listStyle, rowKey } =
    props as ScrollListProps;

  const iterate_scope_variable = `iterate_scope_variable_${renderItem.iterate_scope_variable}`;

  const renderItemFunctionName = `renderItemOfScrollList_${id}`;

  const renderItemCode = `const ${renderItemFunctionName} = (${iterate_scope_variable}, { index }) => (${
    astToReactNodeCodeOfFrontstage(
      {
        ...renderItem.render,
        key: rowKey
          ? `${iterate_scope_variable}.${rowKey}`
          : { [_BUILT_IN_TYPE]: 'variable', code: 'index' },
      },
      declarations,
      context,
    ).call
  });`;

  declarations.put({ name: renderItemFunctionName, code: renderItemCode });

  const renderItemCodeOfProp = {
    [_BUILT_IN_TYPE]: 'variable',
    code: renderItemFunctionName,
  };

  const componentName = `ScrollList`;

  const componentElement = `<ScrollList${generateCodeOfProp(
    'key',
    key,
  )}${generateCodeOfProp('data', data)}${generateCodeOfProp(
    'wrapperStyle',
    wrapperStyle,
  )}${generateCodeOfProp('listStyle', listStyle)}${generateCodeOfProp(
    'renderItem',
    renderItemCodeOfProp,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
    canHoist: false,
  });
};
