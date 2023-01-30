import { notification } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { request } from '@/frontend/utils';
import { useRegisterApi } from '../api';
import { DEFAULT_USER_AVATAR } from '@/backend/config';

export const useRegister = (defaultData?: {
  name?: string;
  avatar?: string;
  desc?: string;
  sex?: 'male' | 'female';
}) => {
  const { user, register: fetchRegisterApi } = useRegisterApi();
  const [name, setName] = useState(defaultData?.name || '');
  const [password, setPassWord] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(
    defaultData?.avatar || DEFAULT_USER_AVATAR,
  );
  const [desc, setDesc] = useState(defaultData?.desc || '');
  const [sex, setSex] = useState<'male' | 'female'>(defaultData?.sex || 'male');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [descError, setDescError] = useState('');
  const [sexError, setSexError] = useState('');

  const checkedNameRef = useRef(name);

  const verify = useCallback(async () => {
    if (!name) {
      setNameError('必须填写姓名');
      return false;
    } else {
      setNameError('');
    }
    if (name && checkedNameRef.current !== name) {
      const { data: noRepeat } = await request(
        `/api/check/username/?userName=${name}`,
      );
      if (!noRepeat) {
        setNameError('用户名已经存在');
      } else {
        setNameError('');
      }
    }
    checkedNameRef.current = name;

    if (!/^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password)) {
      setPasswordError('密码必须包含数字和字母，8~16位，不能有特殊字符');
    } else if (password !== confirmPassword) {
      setPasswordError('两次密码不一致');
      return false;
    } else {
      setPasswordError('');
    }
    if (desc.length > 200) {
      setDescError('用户描述不能超过200字');
      return false;
    } else {
      setDescError('');
    }
    if (sex !== 'male' && sex !== 'female') {
      setSexError('性别不符合规定');
    } else {
      setSexError('');
    }
    return true;
  }, [name, password, confirmPassword, desc]);

  const register = useCallback(async () => {
    const legal = await verify();
    if (legal) {
      return fetchRegisterApi({ name, password, avatar, desc, sex });
    } else {
      notification.error({
        message: '用户注册信息填写不正确',
      });
      return Promise.reject();
    }
  }, [name, password, confirmPassword, avatar, desc, sex, verify]);

  return {
    user,
    name,
    setName,
    password,
    setPassWord,
    confirmPassword,
    setConfirmPassword,
    avatar,
    setAvatar,
    desc,
    setDesc,
    sex,
    setSex,
    nameError,
    passwordError,
    descError,
    sexError,
    verify,
    register,
  };
};
