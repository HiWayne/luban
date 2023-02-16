import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button, Card, Form, Input, Table, DatePicker, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { usePagination } from '@/frontend/hooks';
import { request } from '@/frontend/utils';
import { DeployCategorySelect, PathInput } from '../Editor/components';
import {
  DeployRecordResponseDTO,
  DeployStatus,
} from '@/backend/service/deployService/types';
import { UserInfo } from './components';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { getDeployPath } from '@/frontend/utils/getDeployPath';

const DeployList = () => {
  const [category, setCategory] = useState('');
  const [path, setPath] = useState('');
  const [desc, setDesc] = useState('');
  const [times, setTimes] = useState<(number | null)[]>([]);

  const fetcher = useCallback(
    async (page: number) => {
      const params: any = {};
      if (category) {
        params.category = category;
      }
      if (path) {
        params.path = path;
      }
      if (desc) {
        params.desc = desc;
      }
      if (times && times[0]) {
        params.update_time_start = times[0];
      }
      if (times && times[1]) {
        params.update_time_end = times[1];
      }
      const response = await request(
        `/api/deploy/list/?${new URLSearchParams({
          ...params,
          start: `${(page - 1) * 25}`,
          limit: '25',
        })}`,
      );
      if (response && response.data) {
        return response.data;
      }
    },
    [category, path, desc, times],
  );

  const {
    response,
    fetch: queryDeployList,
    loading,
    total,
    reset,
  } = usePagination<DeployRecordResponseDTO>(fetcher);

  const columns = useMemo(
    () => [
      {
        title: '应用状态',
        dataIndex: 'status',
        render: (status: DeployStatus) =>
          status === 'online' ? (
            <Tag color="#87d068">上线</Tag>
          ) : status === 'offline' ? (
            <Tag color="#f50">下线</Tag>
          ) : (
            <Tag icon={<SyncOutlined spin />} color="processing">
              发布中
            </Tag>
          ),
      },
      {
        title: '分类',
        dataIndex: 'category_name',
      },
      {
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '完整路径',
        render: (_: any, record: DeployRecordResponseDTO) => (
          <span>{getDeployPath(record.category, record.path)}</span>
        ),
      },
      {
        title: '当前版本',
        dataIndex: 'version',
      },
      {
        title: '版本总数',
        dataIndex: 'versions_total',
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        render: (update_time: number) => (
          <span>{dayjs(update_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '最近操作人',
        dataIndex: 'operator',
        render: (operator: UserResponseDTO) => <UserInfo data={operator} />,
      },
      {
        title: '详情',
        dataIndex: 'id',
        render: (id: string) => {
          return <Link to={`/deploy/detail?id=${id}`}>查看详情</Link>;
        },
      },
    ],
    [],
  );

  useEffect(() => {
    reset();
    queryDeployList();
  }, []);

  return (
    <>
      <Card>
        <h2 style={{ marginBottom: '30px' }}>应用发布查询</h2>
        <Form layout="inline">
          <Form.Item label="分类">
            <DeployCategorySelect
              category={category}
              setCategory={setCategory}
              hasEmpty
            />
          </Form.Item>
          <Form.Item label="路径">
            <PathInput onChange={setPath} />
          </Form.Item>
        </Form>
        <Form style={{ marginTop: '20px' }}>
          <Form.Item label="描述">
            <Input.TextArea
              style={{ width: '300px', height: '150px' }}
              placeholder="模糊匹配"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Item>
        </Form>
        <Form>
          <Form.Item label="更新时间">
            <DatePicker.RangePicker
              onChange={(_times: any) => {
                setTimes(
                  _times.map((time: any) =>
                    time ? new Date(time).getTime() : null,
                  ),
                );
              }}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            reset();
            queryDeployList();
          }}>
          查询
        </Button>
      </Card>
      <Card>
        <p style={{ marginBottom: '20px' }}>应用总数：{total}</p>
        <Table
          dataSource={response?.list || []}
          columns={columns}
          pagination={{
            pageSize: 25,
            onChange: queryDeployList,
            disabled: loading,
            total,
          }}
        />
      </Card>
    </>
  );
};

export default DeployList;
