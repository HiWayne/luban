import { CSSProperties } from 'react';
import { NodeAST, ScrollListProps } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createGenerateCodeFnReturn,
  createIdAttrInDev,
  _BUILT_IN_TYPE,
} from '../utils';
import {
  heightConfig,
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

  const {
    data,
    renderItem,
    wrapperHeight,
    wrapperMargin,
    wrapperPadding,
    listMargin,
    listPadding,
    wrapperStyle,
    listStyle,
    rowKey,
  } = props as ScrollListProps;

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

  let finalWrapperStyle: CSSProperties | undefined = {};
  let finalListStyle: CSSProperties | undefined = {};
  if (wrapperHeight) {
    finalWrapperStyle.height = wrapperHeight;
  }
  if (wrapperMargin) {
    finalWrapperStyle.margin = wrapperMargin;
  }
  if (wrapperPadding) {
    finalWrapperStyle.padding = wrapperPadding;
  }
  if (listMargin) {
    finalListStyle.margin = listMargin;
  }
  if (listPadding) {
    finalListStyle.padding = listPadding;
  }
  if (wrapperStyle) {
    finalWrapperStyle = { ...finalWrapperStyle, ...wrapperStyle };
  }
  if (listStyle) {
    finalListStyle = { ...finalListStyle, ...wrapperStyle };
  }
  if (Reflect.ownKeys(finalWrapperStyle).length === 0) {
    finalWrapperStyle = undefined;
  }
  if (Reflect.ownKeys(finalListStyle).length === 0) {
    finalListStyle = undefined;
  }

  const componentName = `ScrollListComponent`;

  const componentDeclaration = `const ${componentName} = ({ role, id, data, wrapperStyle, listStyle, renderItem, children }) => {
    ${context.development ? `const scrollWrapperRef = useRef(null)`: ''}
    const config = useMemo(() => ({ eventPassthrough: 'vertical'}), []);

    return <div role={role} id={id}>
      ${
        context.development
          ? `<div ref={scrollWrapperRef} style={wrapperStyle ? {overflow: 'auto', ...wrapperStyle} : {overflow: 'auto'}}>
              <div style={listStyle ? {display: 'inline-flex', whiteSpace: 'nowrap', ...listStyle} : {display: 'inline-flex', whiteSpace: 'nowrap'}}>
                {Array.isArray(data) && renderItem ? data.map(item => renderItem((item, index), {
                  index: index,
                  bscrollRef: {current: null},
                  scrollWrapperRef: scrollWrapperRef
                })) : children}
              </div>
            </div>`
          : `<ScrollList wrapperStyle={wrapperStyle} listStyle={listStyle} renderItem={renderItem} config={config}>{children}</ScrollList>`
      }
    </div>
  }`;

  const componentCall = `<${componentName}${createIdAttrInDev(
    context.development,
    id,
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp('data', data)}${generateCodeOfProp(
    'wrapperStyle',
    finalWrapperStyle,
  )}${generateCodeOfProp('listStyle', finalListStyle)}${generateCodeOfProp(
    'renderItem',
    renderItemCodeOfProp,
  )}>${children || ''}</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

generateCodeOfScrollList.plugin = {
  level: 1,
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
      ...heightConfig,
      name: '容器高度',
      propName: 'wrapperHeight',
      defaultConfig: {
        value: 100,
      },
    },
    {
      name: '外层外边距',
      description: '容器最外层的外边距',
      required: false,
      propName: 'wrapperMargin',
      formSchema: {
        type: 'css-margin',
      },
    },
    {
      name: '外层内边距',
      description: '容器最外层的内边距',
      required: false,
      propName: 'wrapperPadding',
      formSchema: {
        type: 'css-padding',
      },
    },
    {
      name: '列表外边距',
      description: '容器内部列表的外边距',
      required: false,
      propName: 'listMargin',
      formSchema: {
        type: 'css-margin',
      },
    },
    {
      name: '列表内边距',
      description: '容器内部列表的内边距',
      required: false,
      propName: 'listPadding',
      formSchema: {
        type: 'css-padding',
      },
    },
    {
      name: '外层高级样式',
      description:
        '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置',
      required: false,
      propName: 'wrapperStyle',
      formSchema: {
        type: 'custom-style',
      },
    },
    {
      name: '列表高级样式',
      description:
        '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置',
      required: false,
      propName: 'listStyle',
      formSchema: {
        type: 'custom-style',
      },
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
