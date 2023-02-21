import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Table,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getParams } from '@duitang/dt-base';
import { DtIcon } from '@duitang/dt-react-mobile';
import { ReactComponent as MaleSVG } from 'assets/male.svg';
import { ReactComponent as FemaleSVG } from 'assets/female.svg';
import { Flex, Loading } from '@/frontend/components';
import { useDeleteUserApi, useQueryUserApi, useUpdateUserApi } from '../api';
import { UploadImageConfig } from '../../Editor/components/configComponents/UploadImageConfig';
import { useRegister } from '../hooks';
import { UserRegisterDTO } from '@/backend/service/userService/types';
import useStore from '@/frontend/store';
import { clearTokens } from '../utils';

const OuterWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(https://c-ssl.dtstatic.com/uploads/ops/202302/08/20230208142149_89116.png);
  background-color: #97befc;
  background-size: contain;
  background-position: bottom;
  background-repeat: repeat no-repeat;
`;

const Title = styled.div`
  color: #545454;
  font-size: 24px;
  padding: 10px 0 30px;
`;

const CreateTime = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 20px;
`;

const Description = styled.p`
  margin-bottom: 30px;
  max-width: 400px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  border: 5px double rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 12px;
`;

const UserUpdater = ({
  onChange,
}: {
  onChange: (data: Partial<UserRegisterDTO> & { id: number }) => void;
}) => {
  const user = useStore((store) => store.user.user);
  const {
    name,
    setName,
    nameError,
    sex,
    setSex,
    sexError,
    desc,
    setDesc,
    descError,
    avatar,
    setAvatar,
    verify,
  } = useRegister({
    name: user?.name,
    desc: user?.desc,
    avatar: user?.avatar,
    sex: user?.sex,
  });

  const sexOptions = useMemo(
    () => [
      {
        label: (
          <Flex>
            <span>男</span>
            <MaleSVG />
          </Flex>
        ),
        value: 'male',
      },
      {
        label: (
          <Flex>
            <span>女</span>
            <FemaleSVG />
          </Flex>
        ),
        value: 'female',
      },
    ],
    [],
  );

  useEffect(() => {
    (async () => {
      if (typeof onChange === 'function') {
        const data: any = {};

        data.name = name;

        data.avatar = avatar || '';

        data.desc = desc || '';

        data.sex = sex;

        if (data && user) {
          data.id = user.id;
        }
        if (await verify()) {
          onChange(data);
        }
      }
    })();
  }, [name, avatar, desc, sex, user]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      style={{ padding: '10px 20px' }}>
      <Title>修改用户信息</Title>
      <Form labelCol={{ span: 4 }} labelAlign="left" style={{ width: '100%' }}>
        <Form.Item label="头像">
          <UploadImageConfig
            defaultUrl={avatar}
            onChange={(url) => setAvatar(url)}
          />
        </Form.Item>
        <Form.Item
          label="昵称"
          extra={nameError ? <Alert type="error" message={nameError} /> : null}>
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            onBlur={verify}
          />
        </Form.Item>
        <Form.Item
          label="性别"
          extra={sexError ? <Alert type="error" message={sexError} /> : null}>
          <Radio.Group
            defaultValue={sex}
            options={sexOptions}
            onChange={(event) => setSex(event.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="用户简介"
          extra={descError ? <Alert type="error" message={descError} /> : null}>
          <Input.TextArea
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}
            onBlur={verify}
            maxLength={200}
            showCount
            autoSize
            placeholder="这个用户真能吃，什么也没留下"
          />
        </Form.Item>
      </Form>
    </Flex>
  );
};

const Profile = () => {
  const query = getParams() as any;
  const {
    user,
    queriedUser,
    ownLoading,
    queryLoading,
    queryOwnUser,
    queryUserById,
  } = useQueryUserApi();
  const { updateUser: fetchUpdateUserApi } = useUpdateUserApi();
  const { deleteUser: fetchDeleteUserApi } = useDeleteUserApi();
  const [show, setShow] = useState(false);
  const [updateData, setUpdateData] = useState<
    (Partial<UserRegisterDTO> & { id: number }) | null
  >(null);
  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const navigate = useNavigate();

  const isSelf = useMemo(() => !query?.id, [query?.id]);

  const userData = useMemo(() => {
    if (!isSelf) {
      return queriedUser;
    } else {
      return user;
    }
  }, [user, queriedUser, isSelf]);

  const openModal = useCallback(() => {
    setShow(true);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  const updateUser = useCallback(async () => {
    if (updateData) {
      await fetchUpdateUserApi(updateData);
      closeModal();
    }
  }, [updateData]);

  const openConfirmModal = useCallback(() => {
    setConfirmModalShow(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalShow(false);
  }, []);

  const deleteUser = useCallback(async () => {
    const response = await fetchDeleteUserApi();
    if (response && response.data) {
      notification.success({
        message: '已删除用户',
      });
      clearTokens();
      window.location.href = `${window.location.protocol}//${window.location.host}`;
    } else {
      notification.error({
        message: '删除用户失败',
      });
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    navigate('/', { replace: true });
    window.location.reload();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '设备ip',
        dataIndex: 'ip',
      },
      {
        title: '登录时间',
        dataIndex: 'login_time',
        render: (login_time: number) => (
          <span>{dayjs(login_time).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    if (query?.id) {
      queryUserById(query.id);
    } else if (!user) {
      queryOwnUser();
    }
  }, [query?.id]);

  return (isSelf && !ownLoading) || (!isSelf && !queryLoading) ? (
    <OuterWrapper>
      <Card style={{ display: 'inline-block' }} hoverable>
        <Flex
          direction="column"
          justifyContent="flex-start"
          alignItems="center">
          {userData ? (
            <Avatar
              size={64}
              src={
                <DtIcon
                  noGif={false}
                  width="100%"
                  ratio={1}
                  src={userData.avatar}
                />
              }
            />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} />
          )}
          {userData ? (
            <Flex alignItems="center">
              <h3>{userData.name}</h3>
              {userData.sex === 'female' ? <FemaleSVG /> : <MaleSVG />}
            </Flex>
          ) : (
            <h3>没有该用户</h3>
          )}
          {userData ? (
            <>
              <CreateTime>
                创建时间：{dayjs(userData.create_time).format('YYYY-MM-DD')}
              </CreateTime>
              <Description>{userData.desc}</Description>
            </>
          ) : (
            <Empty />
          )}
          {isSelf ? (
            <Flex
              style={{ width: '320px' }}
              justifyContent="space-between"
              alignItems="center">
              <Button onClick={openModal}>修改用户信息</Button>
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: '确定要退出登录吗？',
                    onOk: logout,
                    centered: true,
                    cancelText: '取消',
                    okText: '确定退出',
                  });
                }}>
                退出登录
              </Button>
              <Button type="primary" danger onClick={openConfirmModal}>
                删除用户
              </Button>
            </Flex>
          ) : null}
        </Flex>
        <h4 style={{ margin: '60px 0 8px 0' }}>最近登录信息</h4>
        <Table
          style={{ width: '600px' }}
          dataSource={userData?.last_login_data || []}
          columns={columns}
          pagination={false}
        />
      </Card>
      <Modal
        cancelText="取消"
        okText="确定修改"
        open={show}
        onCancel={closeModal}
        onOk={updateUser}>
        <UserUpdater onChange={setUpdateData} />
      </Modal>
      <Modal
        cancelText="取消"
        okText="确定删除"
        okType="danger"
        centered
        open={confirmModalShow}
        onCancel={closeConfirmModal}
        onOk={deleteUser}
        title="确定要删除用户吗？">
        该操作不可恢复
      </Modal>
    </OuterWrapper>
  ) : (
    <Loading size="large" />
  );
};

export default Profile;
