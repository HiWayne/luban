import { NodeAST, TableProps } from '@/backend/types/backstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { astToReactNodeCodeOfBackstage, Context, Declarations } from '../index';
import { createGenerateCodeFnReturn } from '../utils';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { generateCodeOfPagination } from './generateCodeOfPagination';

const generateRenderComponent = (
  renderDSL: {
    iterate_scope_variable_name: string;
    render: NodeAST[] | undefined;
  },
  declarations: Declarations,
  context: Context,
) =>
  renderDSL.render
    ? `(_, iterate_scope_variable_name_${
        renderDSL.iterate_scope_variable_name
      }, index) => <>${renderDSL.render.reduce(
        (code, nodeAST) =>
          code +
          astToReactNodeCodeOfBackstage(nodeAST, declarations, context)
            .call,
        '',
      )}</>`
    : undefined;

export const generateCodeOfTable = (
  nodeAST: NodeAST,
  declarations: Declarations,
  context: Context,
) => {
  const { props } = nodeAST;
  const { data, columns, rowKey, pagination } = props as TableProps;

  const columnsCode = `[${columns.reduce((objCode, column, index) => {
    const modifiedColumn: any = { ...column };
    modifiedColumn.render = column.render
      ? generateRenderComponent(column.render, declarations, context)
      : undefined;

    return index === 0
      ? `${objCode}${generateCodeOfLiteral(modifiedColumn)}`
      : `${objCode}, ${generateCodeOfLiteral(modifiedColumn)}`;
  }, '')}]`;

  const {
    componentDeclaration: paginationComponentDeclaration,
    componentCall: paginationComponentCall,
  } = pagination ? generateCodeOfPagination(pagination) : ({} as any);

  const componentName = `TableWithPagination`;

  const componentDeclaration = `
  ${paginationComponentDeclaration}

  const TableWithPagination = ({ dataSource, columns, rowKey }) => (<Table pagination={false} dataSource={dataSource} columns={columns} rowKey={rowKey} />);
  `;

  const componentCall = `<><TableWithPagination${generateCodeOfProp(
    'dataSource',
    data,
  )}${generateCodeOfProp('columns', columnsCode)}${generateCodeOfProp(
    'rowKey',
    rowKey,
  )} />${paginationComponentCall}</>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
