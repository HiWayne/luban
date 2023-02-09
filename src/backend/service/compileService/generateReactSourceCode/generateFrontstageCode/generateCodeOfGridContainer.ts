import { GridContainerProps, NodeAST } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';
import {
  commonContainerConfigs,
  listDataConfig,
  renderItemConfig,
  ToCComponent,
} from './toCComponentsPluginsConfig';

export const generateCodeOfGridContainer = (
  nodeAST: NodeAST,
  id: number,
  children: string | undefined,
  declarations: Declarations,
  context: Context,
) => {
  const { props } = nodeAST;
  const {
    data,
    layout,
    columns,
    renderItem,
    space,
    justifyContent,
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
  } = props as GridContainerProps;

  const componentName = 'GridContainer';

  const LineName = `LineOf${componentName}`;

  const ItemName = `ItemOf${componentName}`;

  const componentDeclaration = `
    const ${LineName} = styled(({ className, children, justifyContent = 'flex-start' }) => <div className={className}>{children}</div>)\`
        display: flex;
        flex-flow: row nowrap;
        justify-content: \${props => props.justifyContent};
        align-items: center;
    \`

    const ${ItemName} = styled(({ className, children, marginLeft, marginTop }) => <div className={className}>{children}</div>)\`
        margin-left: \${props => props.marginLeft};
        margin-top: \${props => props.marginTop};
    \`

  const ${componentName} = ({ role, id, data, layout, columns = 3, verticalSpace, horizontalSpace, children, renderItem: RenderItem, justifyContent, onClick, style = {} }) => {
    const wrapperStyle = useMemo(() => ({
        display: layout === 'inline' ? 'inline-block' : 'block',
        ...style,
    }), [layout]);

    const count = useMemo(() => data ? data.length : children ? children.length : 0, [data, children]);

    const rowCount = useMemo(() => Math.ceil(count / columns), [count, columns]);

    const itemWidth = useMemo(() => layout === 'inline' ? undefined : \`calc(\${(100 / columns).toFixed(1)}% - \${(columns - 1) * horizontalSpace / columns}px)\`, [layout, columns, horizontalSpace]);

    const createArray = useCallback((length) => new Array(length).fill(true), [])

    const computeIndex = useCallback((rowIndex, columnIndex) => columnIndex * (rowIndex + 1), [])

    const render = useCallback((index) => {
        if (data && index < data.length) {
            return <RenderItem data={data[index]} index={index} />
        } else if (children && index < children.length) {
            return children[index]
        } else {
            return null
        }
    }, [data, children])

    return <div role={role} id={id} style={wrapperStyle} onClick={onClick}><div style={{marginLeft: \`-\${horizontalSpace}\`, marginTop: \`-\${verticalSpace}\`}}>{createArray(rowCount).map((_, rowIndex) => (<${LineName} key={rowIndex} justifyContent={justifyContent}>{createArray(columns).map((_, columnIndex) => <${ItemName} key={columnIndex} marginLeft={horizontalSpace} marginTop={verticalSpace}>{render(rowIndex, columnIndex)}</${ItemName}>)}</${LineName}>))}</div></div>
  };`;

  const createSpaceObject = (): {
    verticalSpace: string;
    horizontalSpace: string;
  } => {
    const defaultValue = {
      verticalSpace: '4px',
      horizontalSpace: '4px',
    };
    const formatValue = (value: any) =>
      typeof value === 'number'
        ? `${value}px`
        : typeof value === 'string'
        ? value
        : '4px';
    if (typeof space === 'number') {
      return {
        verticalSpace: formatValue(space),
        horizontalSpace: formatValue(space),
      };
    } else if (space === 'string') {
      const splitSpace = space.split(/\s+/);
      if (splitSpace.length === 1 && splitSpace[0]) {
        return {
          verticalSpace: formatValue(splitSpace[0]),
          horizontalSpace: formatValue(splitSpace[0]),
        };
      } else if (splitSpace.length > 1 && splitSpace[0] && splitSpace[1]) {
        return {
          verticalSpace: formatValue(splitSpace[0]),
          horizontalSpace: formatValue(splitSpace[1]),
        };
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  };

  const spaceObject = createSpaceObject();

  const renderItemCode = renderItem
    ? createBuiltInTypeCode(
        'function',
        `
    ({ data: iterate_scope_variable_${
      renderItem.iterate_scope_variable
    }, index }) => (${
          astToReactNodeCodeOfFrontstage(
            renderItem.render,
            declarations,
            context,
          ).call
        })
  `,
      )
    : undefined;

  const styleObject = {
    width,
    height,
    margin,
    padding,
    backgroundColor,
    backgroundSize,
    backgroundImage: backgroundImage
      ? `url(\\'${backgroundImage}\\')`
      : undefined,
    backgroundPosition,
    backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat',
    borderRadius,
    ...(style || {}),
  };

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
  )}${generateCodeOfProp('data', data)}${generateCodeOfProp(
    'layout',
    layout,
  )}${generateCodeOfProp('columns', columns)}${generateCodeOfProp(
    'verticalSpace',
    spaceObject.verticalSpace,
  )}${generateCodeOfProp(
    'horizontalSpace',
    spaceObject.horizontalSpace,
  )}${generateCodeOfProp('justifyContent', justifyContent)}${generateCodeOfProp(
    'style',
    styleObject,
  )}${generateCodeOfProp('renderItem', renderItemCode)}${generateCodeOfProp(
    'onClick',
    onClickCode,
  )}>${children || ''}</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

generateCodeOfGridContainer.plugin = {
  level: 1,
  sort: 3,
  name: '网格布局容器',
  type: 'GridContainer',
  description:
    '可以将内部内容按网格状布局排列，比如四宫格、九宫格。本身没有内容，里面需要添加内容。',
  defaultAST: {
    type: 'GridContainer',
    props: {
      layout: 'block',
      columns: 3,
      space: 8,
      justifyContent: 'center',
    },
    children: [],
  },
  configs: [
    listDataConfig,
    {
      name: '列数',
      description: '网格有多少列',
      required: false,
      propName: 'columns',
    },
    {
      name: '网格内容间隙',
      description: '网格内容之间的间隙，最边缘的内容与容器之间没有间隙',
      required: false,
      propName: 'space',
    },
    {
      name: '行内对齐方式',
      description:
        '如果网格容器宽度大于一行所有内容+间隙，那么可以配置行内的对齐方式。和Flex容器的对齐方式规则一样。',
      required: false,
      propName: 'justifyContent',
    },
    ...renderItemConfig,
    ...commonContainerConfigs,
  ],
} as ToCComponent;
