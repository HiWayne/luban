import { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { notification } from 'antd';
import useStore from '@/frontend/store';
import { encode } from '../utils';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { request } from '@/frontend/utils';

export const useLoginApi = (
  userName: string,
  password: string,
  remember: boolean,
) => {
  const [user, setUser] = useStore(
    (store) => [store.user.user, store.user.setUser],
    shallow,
  );

  const encodedPassword = useMemo(() => encode(password), [password]);

  const login = useCallback(async () => {
    if (!userName || !encodedPassword) {
      notification.error({
        message: '登录失败',
        description: '必须有用户名和密码',
      });
    }
    const response = await request(
      '/api/login/user/',
      {
        method: 'post',
        body: JSON.stringify({ userName, password: encodedPassword }),
      },
      { successNotify: true, saveToken: remember },
    );
    const userData: UserResponseDTO = response?.data;
    if (userData) {
      setUser(userData);
    }
  }, [userName, encodedPassword, remember]);

  return { user, login };
};
