import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import produce from 'immer';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  notification,
  Table,
} from 'antd';
import { request } from '@/frontend/utils';
import { Flex } from '@/frontend/components';
import { useGetDeployCategoriesApi } from '../Editor/api';
import { CategoryResponseDTO } from '@/backend/service/deployService/types';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { UserInfo } from './components';

const DeployCategoryManage = () => {
  const [list, setList] = useState<CategoryResponseDTO[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modifiedName, setModifiedName] = useState('');
  const [modifiedValue, setModifiedValue] = useState('');
  const [modifiedDesc, setModifiedDesc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadingRef = useRef(false);

  const { fetcher: getCategoriesList } = useGetDeployCategoriesApi();

  const createCategory = useCallback(async () => {
    if (!name || !value) {
      message.error('分类名称、分类值不能为空');
      return;
    }
    const response = await request(
      '/api/create/category/',
      {
        method: 'post',
        body: JSON.stringify({
          name,
          value,
          desc,
        }),
      },
      { successNotify: true },
    );
    if (response && response.data) {
      setName('');
      setValue('');
      setDesc('');
      setList([{ name, value, desc }, ...list]);
    }
  }, [name, value, desc, list]);

  const deleteCategory = useCallback(
    async (valueOfCategory: string) => {
      const response = await request('/api/delete/category/', {
        method: 'delete',
        body: JSON.stringify({
          value: valueOfCategory,
        }),
      });
      if (response && response.data) {
        notification.success({
          message: '删除成功',
        });
        setList(
          produce(list, (draft) => {
            const index = draft.findIndex(
              (item) => item.value === valueOfCategory,
            );
            if (index !== -1) {
              draft.splice(index, 1);
            }
          }),
        );
      }
    },
    [list],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const updateCategory = useCallback(async () => {
    const response = await request('/api/update/category/', {
      method: 'put',
      body: JSON.stringify({
        name: modifiedName,
        value: modifiedValue,
        desc: modifiedDesc || '',
      }),
    });
    if (response && response.data) {
      closeModal();
      notification.success({
        message: '更新成功',
      });
      setList(
        produce(list, (draft) => {
          const index = draft.findIndex((item) => item.value === modifiedValue);
          if (index !== -1) {
            draft[index].desc = modifiedDesc;
          }
        }),
      );
    }
  }, [modifiedName, modifiedValue, modifiedDesc, list]);

  const columns = useMemo(
    () => [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分类值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '分类描述',
        dataIndex: 'desc',
        key: 'value',
      },
      {
        title: '创建者',
        dataIndex: 'author',
        render: (author: UserResponseDTO) => <UserInfo data={author} />,
      },
      {
        title: '更新者',
        dataIndex: 'updater',
        render: (updater: UserResponseDTO) => <UserInfo data={updater} />,
      },
      {
        title: '操作',
        render(_: any, record: any) {
          return (
            <Flex>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setModifiedName(record.name);
                  setModifiedValue(record.value);
                  setModifiedDesc(record.desc);
                  setModalOpen(true);
                }}>
                编辑
              </Button>
              <Button
                style={{ marginLeft: '4px' }}
                size="small"
                danger
                onClick={() => {
                  Modal.confirm({
                    content: `确定要删除【${record.name}】分类吗？`,
                    onOk: () => deleteCategory(record.value),
                  });
                }}>
                删除
              </Button>
            </Flex>
          );
        },
      },
    ],
    [deleteCategory],
  );

  const onPageChange = useCallback(async (page: number) => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    const data = await getCategoriesList(page).finally(() => {
      loadingRef.current = false;
      setLoading(false);
    });
    if (data) {
      setList(data.list);
      setTotal(data.total);
    }
  }, []);

  useEffect(() => {
    onPageChange(1);
  }, []);

  return (
    <>
      <Card>
        <Form>
          <Form.Item label="分类名称" required>
            <Input
              style={{ width: '200px' }}
              value={name}
              maxLength={10}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="分类值" required>
            <Input
              style={{ width: '200px' }}
              value={value}
              maxLength={20}
              onChange={(e) => setValue(e.target.value)}
              placeholder="只能是字母或数字"
            />
          </Form.Item>
          <Form.Item label="分类描述">
            <Input.TextArea
              style={{ width: '400px', height: '200px' }}
              maxLength={200}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" onClick={createCategory}>
            创建分类
          </Button>
        </Form>
      </Card>
      <Card>
        <Table
          dataSource={list}
          columns={columns}
          pagination={{
            pageSize: 25,
            onChange: onPageChange,
            disabled: loading,
            total,
          }}
        />
      </Card>
      <Modal open={modalOpen} onCancel={closeModal} onOk={updateCategory}>
        <Form>
          <Form.Item label="分类描述">
            <Input.TextArea
              style={{ width: '350px', height: '100px' }}
              maxLength={200}
              value={modifiedDesc}
              onChange={(e) => setModifiedDesc(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeployCategoryManage;
