import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  notification,
  Radio,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getParams } from '@duitang/dt-base';
import { DtIcon } from '@duitang/dt-react-mobile';
import { Flex, Loading } from '@/frontend/components';
import { useDeleteUserApi, useQueryUserApi, useUpdateUserApi } from '../api';
import { UploadImageConfig } from '../../Editor/components/configComponents/UploadImageConfig';
import { useRegister } from '../hooks';
import { UserRegisterDTO } from '@/backend/service/userService/types';
import useStore from '@/frontend/store';
import { clearTokens } from '../utils';

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
          <div>
            <span>男</span>
            <span style={{ color: '#58a4eb', fontWeight: 'bolder' }}>♂</span>
          </div>
        ),
        value: 'male',
      },
      {
        label: (
          <div>
            <span>女</span>
            <span style={{ color: '#e071ad', fontWeight: 'bolder' }}>♀</span>
          </div>
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
    <div>
      <Form>
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
            placeholder="这个用户真能吃，什么也没留下"
          />
        </Form.Item>
      </Form>
    </div>
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

  useEffect(() => {
    if (query?.id) {
      queryUserById(query.id);
    } else if (!user) {
      queryOwnUser();
    }
  }, [query?.id]);

  return (isSelf && !ownLoading) || (!isSelf && !queryLoading) ? (
    <>
      <Flex direction="column" justifyContent="flex-start" alignItems="center">
        {userData ? (
          <Avatar
            size={64}
            src={<DtIcon width="100%" ratio={1} src={userData.avatar} />}
          />
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
        {userData ? <h3>{userData.name}</h3> : <h3>没有该用户</h3>}
        {userData ? (
          <>
            <p>创建时间：{dayjs(userData.create_time).format('YYYY-MM-DD')}</p>
            <p style={{ maxWidth: '350px' }}>{userData.desc}</p>
          </>
        ) : null}
        {isSelf ? (
          <Flex
            style={{ width: '220px' }}
            justifyContent="space-between"
            alignItems="center">
            <Button onClick={openModal}>修改用户信息</Button>
            <Button type="primary" danger onClick={openConfirmModal}>
              删除用户
            </Button>
          </Flex>
        ) : null}
      </Flex>
      <Modal open={show} onCancel={closeModal} onOk={updateUser}>
        <UserUpdater onChange={setUpdateData} />
      </Modal>
      <Modal
        open={confirmModalShow}
        onCancel={closeConfirmModal}
        onOk={deleteUser}>
        确定要删除用户吗？
      </Modal>
    </>
  ) : (
    <Loading size="large" />
  );
};

export default Profile;
