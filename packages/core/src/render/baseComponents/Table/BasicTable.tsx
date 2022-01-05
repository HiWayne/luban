import { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { Button, Table } from 'antd';
import { clone } from 'ramda';
import { Api, ColumnNames, OffsetConst } from '@core/types/types';
import { useTree, usePagination, useApi } from '@core/hooks/index';
import { fetchByApiConfig } from '@core/hooks/useApi';
import {
  executeFunction,
  verifyExecuteResult,
  convertRelativeToAbsolute,
  definePropertyOfIdentifier,
  IDENTIFIER_REFRESH,
} from '@core/utils/index';
import TableColumnRender from './TableColumnRender';

interface BasicColumn {
  title: string;
  name?: ColumnNames;
  dataIndex?: string;
  computeData?: string;
}

export interface BasicTableProps extends CommonProps {
  columns: BasicColumn[];
  canSelect: boolean;
  selectApi: Api;
  hasOperate: boolean;
  operateName?: string;
  operateApi?: Api;
  hasDelete: boolean;
  deleteApi?: Api;
  pagination: Api | any;
}

export const BasicTable: FunctionComponent<BasicTableProps> = ({
  columns,
  hasDelete,
  hasOperate,
  operateName,
  operateApi,
  deleteApi,
  canSelect,
  selectApi,
  state,
  computeData,
  pagination: paginationConfig,
}) => {
  const { nodeState } = useTree({ state });

  const selectedRowsRef = useRef<any[]>([]);
  const selectedRowKeysRef = useRef<any[]>([]);

  const dataSource = useMemo(() => {
    const data = computeData ? executeFunction(computeData, nodeState[0]?.response) : nodeState[0]?.response;
    if (!verifyExecuteResult(data)) {
      console.error('computeData occurred error in BasicTable');
      return [];
    }
    return data;
  }, [computeData, nodeState]);

  const api = useMemo(() => clone(paginationConfig.api), [paginationConfig.api]);

  const fetchByApi = useApi({ api, state });

  const refreshFetch = useCallback(() => {
    definePropertyOfIdentifier(api, IDENTIFIER_REFRESH);
    fetchByApi();
  }, [api, fetchByApi]);

  const _columns = useMemo(() => {
    const result = columns.map((column) => ({
      title: column.title,
      dataIndex: column.dataIndex,
      key: column.dataIndex,
      render: (v: any, row: any) => {
        const value = column.computeData ? executeFunction(column.computeData, v, row) : v;
        if (!verifyExecuteResult(value)) {
          console.error('column.computeData occurred in BasicTable');
          return null;
        } else {
          return <TableColumnRender key={column.dataIndex} data={column} value={value} />;
        }
      },
    }));
    if (hasOperate || hasDelete) {
      result.push({
        title: '编辑',
        key: '_edit',
        render: (v: any, row: any) => {
          const handleOperate = () => {
            if (operateApi) {
              fetchByApiConfig(operateApi, row).then(refreshFetch);
            }
          };
          const handleDelete = () => {
            if (deleteApi) {
              fetchByApiConfig(deleteApi, deleteApi.computeParams ? row : { id: row.id }).then(refreshFetch);
            }
          };
          return (
            <>
              {hasOperate ? <Button onClick={handleOperate}>{operateName || '操作'}</Button> : null}
              {hasDelete ? (
                <Button
                  onClick={handleDelete}
                  style={{
                    marginLeft: hasOperate ? convertRelativeToAbsolute(OffsetConst.MINI_LEFT_OFFSET) : undefined,
                  }}
                  danger
                >
                  删除
                </Button>
              ) : null}
            </>
          );
        },
      } as any);
    }
    return result;
  }, [columns, hasOperate, hasDelete, operateName, operateApi, deleteApi, refreshFetch]);

  const handleBatchClick = useCallback(() => {
    if (selectApi) {
      fetchByApiConfig(
        selectApi,
        selectApi.computeParams ? selectedRowsRef.current : { ids: selectedRowKeysRef.current.join(',') },
      ).then(refreshFetch);
    }
  }, [selectApi, refreshFetch]);

  const rowSelection = useMemo(
    () =>
      canSelect
        ? {
            onChange(selectedRowKeys: any[], selectedRows: any[]) {
              selectedRowKeysRef.current = selectedRowKeys;
              selectedRowsRef.current = selectedRows;
            },
          }
        : undefined,
    [canSelect],
  );

  const { pagination, isLoading } = usePagination(paginationConfig);

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={_columns}
        rowSelection={rowSelection}
        pagination={pagination}
        style={{
          marginTop: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
          marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
        }}
        loading={isLoading}
      />
      {canSelect ? (
        <Button
          style={{
            marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
            marginBottom: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
          }}
          onClick={handleBatchClick}
          type="primary"
        >
          批量操作
        </Button>
      ) : null}
    </>
  );
};
