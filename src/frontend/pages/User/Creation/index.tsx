import { useEffect, useMemo, useCallback } from 'react';
import { Button, Card, Table, Tag, Image, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { TemplateBriefResponseDTO } from '@/backend/service/templateService/types';
import { usePagination } from '@/frontend/hooks';
import { request } from '@/frontend/utils';
import { dtThumb } from '@duitang/dt-base';

const Creation = () => {
  const navigate = useNavigate();

  const fetcher = useCallback(async (page: number) => {
    const response = await request(
      `/api/get/own/templates/${`?${new URLSearchParams({
        start: `${(page - 1) * 25}`,
      })}`}`,
    );
    return response.data;
  }, []);

  const {
    response,
    fetch: queryOwnTemplates,
    loading,
    total,
    reset,
  } = usePagination<TemplateBriefResponseDTO>(fetcher);

  useEffect(() => {
    reset();
    queryOwnTemplates();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 60,
      },
      {
        title: '标签',
        dataIndex: 'tags',
        render: (tags: string[]) => {
          return tags.map((tag) => (
            <Tag key={tag} color="geekblue">
              {tag}
            </Tag>
          ));
        },
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time: number) => (
          <span>{dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        width: 120,
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        render: (update_time: number) => (
          <span>{dayjs(update_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        width: 120,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 300,
      },
      {
        title: '预览图',
        dataIndex: 'preview',
        render: (preview: string) => (
          <Image width={100} src={dtThumb(preview, 200, false, true)} />
        ),
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status: 'active' | 'inactive') =>
          status === 'active' ? (
            <Tag color="success">active</Tag>
          ) : (
            <Tag color="error">inactive</Tag>
          ),
        width: 80,
      },
      {
        title: '操作',
        render: (templateData: TemplateBriefResponseDTO) => {
          return (
            <>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  navigate(
                    `/editor?type=template&ui=${templateData.type}&id=${templateData.id}`,
                  );
                }}>
                查看
              </Button>
              <Popconfirm
                title="是否删除此模板？"
                onConfirm={async () => {
                  const response = await request(
                    `/api/delete/template/?id=${templateData.id}`,
                    {
                      method: 'delete',
                    },
                  );
                  if (response.data) {
                    reset();
                    queryOwnTemplates();
                  }
                }}
                okText="确定"
                okType="danger"
                cancelText="取消">
                <Button size="small" type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
        width: 120,
      },
    ],
    [],
  );

  return (
    <div>
      <Card>
        <p style={{ marginBottom: '20px' }}>我的模板总数：{total}</p>
        <Table
          dataSource={response?.list || []}
          columns={columns}
          pagination={{
            pageSize: 25,
            onChange: queryOwnTemplates,
            disabled: loading,
            total,
          }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default Creation;
