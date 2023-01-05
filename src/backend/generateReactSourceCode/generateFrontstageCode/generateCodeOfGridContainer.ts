import { GridContainerProps, NodeAST } from '@/backend/types/frontstage';
import { astToReactNodeCodeOfFrontstage, Context, Declarations } from '..';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createBuiltInTypeCode, createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfGridContainer = (
  nodeAST: NodeAST,
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

  const ${componentName} = ({ data, layout, columns = 3, verticalSpace, horizontalSpace, children, renderItem: RenderItem, justifyContent, style = {} }) => {
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

    return <div style={wrapperStyle}><div style={{marginLeft: \`-\${horizontalSpace}\`, marginTop: \`-\${verticalSpace}\`}}>{createArray(rowCount).map((_, rowIndex) => (<${LineName} key={rowIndex} justifyContent={justifyContent}>{createArray(columns).map((_, columnIndex) => <${ItemName} key={columnIndex} marginLeft={horizontalSpace} marginTop={verticalSpace}>{render(rowIndex, columnIndex)}</${ItemName}>)}</${LineName}>))}</div></div>
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

  const componentCall = `<${componentName}${generateCodeOfProp(
    'data',
    data,
  )}${generateCodeOfProp('layout', layout)}${generateCodeOfProp(
    'columns',
    columns,
  )}${generateCodeOfProp(
    'verticalSpace',
    spaceObject.verticalSpace,
  )}${generateCodeOfProp(
    'horizontalSpace',
    spaceObject.horizontalSpace,
  )}${generateCodeOfProp('justifyContent', justifyContent)}${generateCodeOfProp(
    'style',
    styleObject,
  )}${generateCodeOfProp('renderItem', renderItemCode)}>${
    children || ''
  }</${componentName}>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
