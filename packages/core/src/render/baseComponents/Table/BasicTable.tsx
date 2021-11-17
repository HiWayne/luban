import { FunctionComponent, useMemo } from 'react';
import { Button, Table } from 'antd';
import { Api, ColumnNames } from 'types/types';
import { useTree } from 'hooks/index';
import { executeFunction, verifyExecuteResult, fetchByApiConfig } from 'utils/index';
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
}) => {
  const { nodeState } = useTree({ state });

  const dataSource = useMemo(() => {
    const data = computeData ? executeFunction(computeData, nodeState[0]?.response) : nodeState[0]?.response;
    if (!verifyExecuteResult(data)) {
      console.error('computeData occurred error in BasicTable');
      return [];
    }
    return data;
  }, [computeData, nodeState]);

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
              fetchByApiConfig(operateApi, undefined);
            }
          };
          const handleDelete = () => {
            if (deleteApi) {
              fetchByApiConfig(deleteApi, undefined);
            }
          };
          return (
            <>
              {hasOperate ? <Button onClick={handleOperate}>{operateName || '编辑'}</Button> : null}
              {hasDelete ? <Button onClick={handleDelete}>删除</Button> : null}
            </>
          );
        },
      } as any);
    }
    return result;
  }, [columns, hasOperate, hasDelete, operateName, operateApi, deleteApi]);
  return (
    <>
      <Table dataSource={dataSource} columns={_columns} />
      {canSelect ? <Button>批量操作</Button> : null}
    </>
  );
};
