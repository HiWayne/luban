import { FunctionComponent, Key, useMemo } from 'react';
import { Table as AntdTable } from 'antd';
import { useTree, usePagination } from 'hooks/index';
import RenderNode from 'render/Render';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfLevel,
  executeFunction,
  verifyExecuteResult,
} from 'utils/index';
import { ComponentNames, Api, ComponentLevel } from 'types/types';
import { BasicTableProps, BasicTable } from './BasicTable';
import TableColumnRender from './TableColumnRender';

interface AdvancedColumn {
  title: string;
  dataIndex: string;
  render: VDomNode[];
  computeData?: string;
  name?: string;
}

enum RowSelectionType {
  checkbox = 'checkbox',
  radio = 'radio',
}

interface AdvancedTableProps extends CommonProps {
  columns: AdvancedColumn[];
  rowSelectionType?: RowSelectionType;
  computeData?: string;
  pagination?: Pagination;
  api: Api;
}

type TableProps = BasicTableProps | AdvancedTableProps;

const AdvancedTable: FunctionComponent<AdvancedTableProps> = ({
  columns: _columns,
  rowSelectionType,
  state,
  model,
  effect,
  computeData,
  topOffset,
  leftOffset,
  pagination: paginationConfig,
  api,
}) => {
  const { nodeState, handleModelChange, isShow } = useTree({ state, model, effect });

  const dataSource = useMemo(
    () => (computeData ? executeFunction(computeData, nodeState[0]?.response) : nodeState[0]?.response),
    [nodeState, computeData],
  );

  const rowSelection = useMemo(
    () => ({
      type: rowSelectionType,
      onChange(_selectedRowKeys: Key[], selectedRows: any[]) {
        handleModelChange(selectedRows);
      },
    }),
    [rowSelectionType, handleModelChange],
  );

  const columns = useMemo(
    () =>
      _columns.map((column) => ({
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.dataIndex,
        render: column.render
          ? (v: any, record: any) => (
              <>
                {column.render.map((node) => {
                  return <RenderNode key={node.id} data={{ ...node, ioc: record }} />;
                })}
              </>
            )
          : column.name
          ? (v: any, record: any) => {
              const value = column.computeData ? executeFunction(column.computeData, v, record) : v;
              if (!verifyExecuteResult(value)) {
                console.error('column.computeData occurred in AdvancedTable');
                return null;
              } else {
                return <TableColumnRender key={column.dataIndex} data={column} value={value} />;
              }
            }
          : undefined,
      })),
    [_columns],
  );

  const { pagination, isLoading } = usePagination(paginationConfig, nodeState);

  if (!verifyExecuteResult(dataSource)) {
    console.error('computeData occurred error in "table"');
    return null;
  }

  return isShow ? (
    <AntdTable
      dataSource={dataSource}
      rowSelection={rowSelection}
      columns={columns}
      style={{ marginTop: convertRelativeToAbsolute(topOffset), marginLeft: convertRelativeToAbsolute(leftOffset) }}
      pagination={pagination}
      loading={isLoading}
    />
  ) : null;
};

const Table: FunctionComponent<TableProps> = (props) => {
  switch (props.level) {
    case ComponentLevel.BASIC:
      return <BasicTable {...(props as BasicTableProps)} />;
    case ComponentLevel.ADVANCED:
      return <AdvancedTable {...(props as AdvancedTableProps)} />;
    default:
      return null;
  }
};

definePropertyOfName(Table, ComponentNames.TABLE);
definePropertyOfLevel(Table, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Table;
