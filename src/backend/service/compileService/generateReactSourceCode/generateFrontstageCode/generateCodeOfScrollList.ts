import { NodeAST, ScrollListProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createGenerateCodeFnReturn,
  createIdAttrInDev,
  _BUILT_IN_TYPE,
} from '../utils';
import {
  listDataConfig,
  renderItemConfig,
  ToCComponent,
} from './toCComponentsPluginsConfig';

export const generateCodeOfScrollList = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  declarations: Declarations,
  context: Context,
) => {
  const { props, key } = nodeAST;

  const { data, renderItem, wrapperStyle, listStyle, rowKey } =
    props as ScrollListProps;

  let renderItemCodeOfProp;

  if (data && renderItem) {
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

    renderItemCodeOfProp = {
      [_BUILT_IN_TYPE]: 'variable',
      code: renderItemFunctionName,
    };
  }

  const componentName = `ScrollList`;

  const componentElement = `<div${createIdAttrInDev(
    context.development,
    id,
  )}><${componentName}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'data',
    data,
  )}${generateCodeOfProp('wrapperStyle', wrapperStyle)}${generateCodeOfProp(
    'listStyle',
    listStyle,
  )}${generateCodeOfProp('renderItem', renderItemCodeOfProp)}>${
    children || ''
  }</${componentName}></div>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentElement,
    canHoist: false,
  });
};

generateCodeOfScrollList.plugin = {
  sort: 4,
  name: '水平滚动容器',
  type: 'ScrollList',
  description: '水平滚动列表',
  defaultAST: {
    type: 'ScrollList',
    props: {},
    children: [],
  },
  configs: [
    listDataConfig,
    {
      name: '外层样式wrapperStyle',
      description:
        '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置，style类型是React.CSSProperties',
      required: false,
      propName: 'wrapperStyle',
    },
    {
      name: '列表样式listStyle',
      description:
        '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置，style类型是React.CSSProperties',
      required: false,
      propName: 'listStyle',
    },
    ...renderItemConfig,
    {
      name: '行key字段',
      description: 'react key所取的字段名，没有默认取循环里的index',
      required: false,
      propName: 'rowKey',
    },
  ],
} as ToCComponent;
