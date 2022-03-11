import { FunctionComponent, Key, useMemo } from 'react';
import { Table as AntdTable } from 'antd';
import { useTree, usePagination, useRenderEditableWrapper } from '@core/hooks/index';
import RenderNode from '../../../render/Render';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfAliasName,
  definePropertyOfLevel,
  definePropertyOfConfig,
  executeFunction,
  verifyExecuteResult,
} from '@core/utils/index';
import { ComponentNames, Api, ComponentLevel } from '@core/types/types';
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

const AdvancedTable: FunctionComponent<AdvancedTableProps> = (props) => {
  const {
    columns: _columns,
    rowSelectionType,
    state,
    model,
    computeData,
    topOffset,
    leftOffset,
    pagination: paginationConfig,
    renderEditableWrapper,
    hierarchicalRecords,
    _editable,
  } = props;
  const { nodeState, handleModelChange, isShow } = useTree({ state, model });

  const { extraStyleOfRoot, renderedEditable } = useRenderEditableWrapper(renderEditableWrapper, props);

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
                {column.render.map((vdomNode, index) => {
                  const hierarchicalRecordsOfThis = [...hierarchicalRecords];
                  hierarchicalRecordsOfThis.push(index);
                  return (
                    <RenderNode
                      key={vdomNode.id}
                      data={{ ...vdomNode, inject: record, hierarchicalRecords: hierarchicalRecordsOfThis }}
                      editable={_editable}
                    />
                  );
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

  const { pagination, isLoading } = usePagination(paginationConfig);

  if (!verifyExecuteResult(dataSource)) {
    console.error('computeData occurred error in "table"');
    return null;
  }

  return isShow ? (
    <div style={extraStyleOfRoot}>
      <AntdTable
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns}
        style={{ marginTop: convertRelativeToAbsolute(topOffset), marginLeft: convertRelativeToAbsolute(leftOffset) }}
        pagination={pagination}
        loading={isLoading}
      />
      {renderedEditable}
    </div>
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
definePropertyOfAliasName(Table, '表格');
definePropertyOfLevel(Table, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);
definePropertyOfConfig(Table, {
  [ComponentLevel.BASIC]: {
    columns: {
      require: true,
      type: 'tableColumns',
      name: '表格列配置',
      tip: '配置每列的字段和显示方式等',
    },
    hasDelete: {
      require: true,
      type: 'boolean',
      name: '是否有删除按钮',
      tip: '每行是否有删除操作',
    },
    hasOperate: {
      require: true,
      type: 'boolean',
      name: '是否有操作按钮',
      tip: '每行是否有除了删除以外的其他操作，该按钮会在删除按钮的左边',
    },
    operateName: {
      require: false,
      type: 'string',
      name: '操作按钮名称',
      tip: '删除按钮的左边按钮的名称',
    },
    operateApi: {
      require: false,
      type: 'api',
      name: '操作按钮请求配置',
      tip: '点击操作按钮后的请求相关的配置',
    },
    deleteApi: {
      require: false,
      type: 'api',
      name: '点击删除按钮后的请求相关的配置',
      tip: '',
    },
    canSelect: {
      require: true,
      type: 'boolean',
      name: '表格行是否有多选功能',
      tip: '',
    },
    selectApi: {
      require: false,
      type: 'api',
      name: '批量请求配置',
      tip: '如果表格有多选功能则该配置负责点击批量操作按钮后的请求',
    },
    state: {
      require: true,
      type: 'path',
      name: '表格数据',
      tip: '表格数据依赖的状态路径（在state中）',
    },
    computeData: {
      require: false,
      type: 'function',
      name: '数据计算函数',
      tip: '如果数据不能直接使用则需要通过函数计算，函数接受一个参数，参数是后端返回的原始数据，return计算后的数据，注意判断undefined',
    },
    pagination: {
      require: true,
      type: 'pagination',
      name: '表格翻页配置',
      tip: '',
    },
  },
  [ComponentLevel.ADVANCED]: {
    columns: {
      require: true,
      type: 'tableColumns',
      name: '表格列配置',
      tip: '配置每列的字段和显示方式等',
    },
    rowSelectionType: {
      require: false,
      type: 'rowSelectionType',
      name: '表格行选择类型',
      tip: '开启后，表格行可以多选或单选',
    },
    state: {
      require: true,
      type: 'path',
      name: '表格数据',
      tip: '表格数据依赖的状态路径（在state中）',
    },
    model: {
      require: true,
      type: 'path',
      name: '选择行数据',
      tip: '选择某行后数据存放的路径（在model中）',
    },
    computeData: {
      require: false,
      type: 'function',
      name: '数据计算函数',
      tip: '如果数据不能直接使用则需要通过函数计算，函数接受一个参数，参数是后端返回的原始数据，return计算后的数据，注意判断undefined',
    },
    topOffset: {
      require: false,
      type: 'number',
      name: '上偏移',
      tip: '增加或减少上边距',
    },
    leftOffset: {
      require: false,
      type: 'number',
      name: '下偏移',
      tip: '增加或减少下边距',
    },
    pagination: {
      require: true,
      type: 'pagination',
      name: '表格翻页配置',
      tip: '',
    },
  },
});

export default Table;
