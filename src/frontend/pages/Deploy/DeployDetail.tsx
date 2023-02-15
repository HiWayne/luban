import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { getParams } from '@duitang/dt-base';
import {
  Button,
  Card,
  Descriptions,
  Empty,
  message,
  Modal,
  Table,
  Tag,
} from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import {
  DeleteDeployDTO,
  DeployChangeVersionRequestDTO,
  DeployDetailDTO,
} from '@/backend/service/deployService/types';
import { getDeployPath } from '@/frontend/utils/getDeployPath';
import { UserInfo } from './components';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { Flex, Loading } from '@/frontend/components';
import { request } from '@/frontend/utils';

const DeployDetail = () => {
  const [detail, setDetail] = useState<DeployDetailDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);

  const fullPath = useMemo(
    () => (detail ? getDeployPath(detail.category, detail.path) : ''),
    [detail],
  );

  const getDetail = useCallback(async () => {
    const params = getParams() || {};
    const id = params.id;
    if (id) {
      setLoading(true);
      const response = await request(`/api/deploy/detail/?id=${id}`).finally(
        () => {
          setLoading(false);
        },
      );
      if (response && response.data) {
        setDetail(response.data);
      }
    } else {
      message.error('缺少id');
    }
  }, []);

  const changeDeployVersion = useCallback(
    async ({ category, path, version }: DeployChangeVersionRequestDTO) => {
      setDeployLoading(true);
      const response = await request('/api/deploy/change/version/', {
        method: 'post',
        body: JSON.stringify({ category, path, version }),
      }).finally(() => {
        setDeployLoading(false);
      });
      if (response && response.data) {
        message.success(`【${fullPath}】成功切换到版本【${version}】`);
        getDetail();
      }
    },
    [],
  );

  const deleteDeploy = useCallback(async ({ id, version }: DeleteDeployDTO) => {
    const response = await request<boolean>('/api/deploy/delete/', {
      method: 'delete',
      body: JSON.stringify({
        id,
        version,
      }),
    });
    if (response && response.data) {
      message.success(`成功删除版本【${version}】`);
      getDetail();
    }
  }, []);

  const offline = useCallback(async () => {
    if (detail) {
      const response = await request('/api/deploy/offline/', {
        method: 'post',
        body: JSON.stringify({ id: detail.id }),
      });
      if (response && response.data) {
        getDetail();
      }
    }
  }, [detail]);

  const online = useCallback(async () => {
    if (detail) {
      setDeployLoading(true);
      const response = await request('/api/deploy/online/', {
        method: 'post',
        body: JSON.stringify({ id: detail.id }),
      }).finally(() => {
        setDeployLoading(false);
      });
      if (response && response.data) {
        getDetail();
      }
    }
  }, [detail]);

  const columns = useMemo(
    () => [
      {
        title: '版本号',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '页面标题',
        dataIndex: 'title',
      },
      {
        title: '版本描述',
        dataIndex: 'desc',
      },
      {
        title: '创建者',
        dataIndex: 'author',
        render: (author: UserResponseDTO) => <UserInfo data={author} />,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time: number) => (
          <span>{dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'version',
        render: (version: number) => (
          <Flex>
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: '确定发布此版本？',
                  content: `您将使用版本【${version}】的内容覆盖【${fullPath}】`,
                  onOk: () => {
                    changeDeployVersion({
                      category: detail!.category,
                      path: detail!.path,
                      version,
                    });
                  },
                });
              }}>
              发布
            </Button>
            <Button
              style={{ marginLeft: '8px' }}
              danger
              onClick={() => {
                Modal.confirm({
                  title: `确定删除版本【${version}】？`,
                  content: (
                    <>
                      {version === detail!.version ? (
                        <>
                          <span style={{ color: '#ff4d4f' }}>
                            此版本删除后应用链接将无法访问！
                          </span>
                          <br />
                        </>
                      ) : null}
                      <span>
                        删除操作不可恢复，如果删除的版本是当前上线的版本，还会导致应用链接无法访问。请谨慎操作。
                      </span>
                    </>
                  ),
                  onOk: () => {
                    deleteDeploy({ id: detail!.id, version });
                  },
                });
              }}>
              删除
            </Button>
          </Flex>
        ),
      },
    ],
    [fullPath],
  );

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      <Card>
        {detail ? (
          <>
            <Descriptions
              style={{ width: '1200px' }}
              title="应用发布信息"
              layout="horizontal"
              column={3}>
              <Descriptions.Item
                labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
                label="应用路径">
                <a style={{ fontSize: '16px' }} href={fullPath} type="_blank">
                  {fullPath}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="当前版本">
                {detail.version}
              </Descriptions.Item>
              <Descriptions.Item label="应用状态">
                {deployLoading ? (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    发布中
                  </Tag>
                ) : detail.status === 'online' ? (
                  <Tag color="#87d068">上线</Tag>
                ) : detail.status === 'offline' ? (
                  <Tag color="#f50">下线</Tag>
                ) : (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    发布中
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="最近更新时间">
                {dayjs(detail.update_time).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="最近操作人">
                <UserInfo data={detail.operator} />
              </Descriptions.Item>
            </Descriptions>
            {detail.status === 'online' ? (
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: '确定要下线吗？',
                    content: '下线不会删除发布历史版本',
                    onOk: offline,
                  });
                }}
                danger>
                下线应用
              </Button>
            ) : detail.status === 'offline' ? (
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: '确定要上线吗？',
                    content: '将会使用应用最新版本上线',
                    onOk: online,
                  });
                }}
                type="primary">
                上线应用
              </Button>
            ) : null}
          </>
        ) : loading ? (
          <Loading />
        ) : (
          <Empty />
        )}
      </Card>
      <Card style={{ marginTop: '30px' }}>
        <h3 style={{ margin: '6px 0' }}>应用历史版本</h3>
        {detail ? (
          <Table
            dataSource={
              detail?.applications?.sort((a, b) => b.version - a.version) || []
            }
            columns={columns}
            pagination={false}
          />
        ) : loading ? (
          <Loading />
        ) : (
          <Empty />
        )}
      </Card>
      ;
    </>
  );
};

export default DeployDetail;
