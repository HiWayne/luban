import { FunctionComponent, Key, useMemo, useState } from 'react';
import { Table as AntdTable, TablePaginationConfig } from 'antd';
import { useTree } from 'hooks/index';
import RenderNode from 'render/Render';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfLevel,
  executeFunction,
  verifyExecuteResult,
  fetchByApiConfig,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const { nodeState, handleModelChange, handleStateChange, isShow, nodeModel } = useTree({ state, model, effect });

  // 是否正在请求
  const isLoading = nodeState[0]?._loading;
  // 是否是refresh类型的请求，是 则翻页器回到第一页
  const isRefresh = nodeState[0]?._refresh;

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

  const pagination: TablePaginationConfig | boolean = useMemo(() => {
    if (paginationConfig) {
      const limit = paginationConfig.limit;
      let startParams = {},
        hasMore = false,
        total = 0;
      if (paginationConfig.computeStart) {
        startParams = executeFunction(paginationConfig.computeStart, nodeState[0]?.response);
        if (!verifyExecuteResult(startParams)) {
          console.error('paginationConfig.computeStart occurred error in table pagination');
          return false;
        }
      }
      if (paginationConfig.computeMore) {
        hasMore = executeFunction(paginationConfig.computeMore, nodeState[0]?.response);
        if (!verifyExecuteResult(hasMore)) {
          console.error('paginationConfig.computeMore occurred error in table pagination');
          return false;
        }
      }
      if (paginationConfig.computeTotal) {
        total = executeFunction(paginationConfig.computeTotal, nodeState[0]?.response);
        if (!verifyExecuteResult(total)) {
          console.error('paginationConfig.computeTotal occurred error in table pagination');
          return false;
        }
      }
      return paginationConfig
        ? {
            position: ['bottomRight'],
            current: isRefresh ? 1 : currentPage,
            pageSize: limit,
            total: total,
            onChange(page: number, pageSize: number | undefined) {
              if (!paginationConfig.computeMore) {
                hasMore = total - (page - 1) * pageSize! > 0;
              }
              if (!hasMore) {
                return;
              }
              if (!paginationConfig.computeStart) {
                startParams = { start: (page - 1) * pageSize! };
              }
              const params = { ...nodeModel[0], ...startParams, limit: pageSize };
              setPaginationLoading(true);
              fetchByApiConfig(api, params, handleStateChange, nodeState[0])
                .then(() => {
                  setCurrentPage(page);
                })
                .finally(() => {
                  setPaginationLoading(false);
                });
            },
            disabled: paginationLoading,
          }
        : false;
    } else {
      return false;
    }
  }, [paginationConfig, nodeState, api, handleStateChange, nodeModel, paginationLoading, isRefresh, currentPage]);

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
