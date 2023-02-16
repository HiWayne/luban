import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import useStore from '@/frontend/store';
import {
  UserRegisterDTO,
  UserResponseDTO,
} from '@/backend/service/userService/types';
import { encode } from '../utils';
import { request } from '@/frontend/utils';

export const useRegisterApi = () => {
  const [user, setUser] = useStore(
    (store) => [store.user.user, store.user.setUser],
    shallow,
  );

  const register = useCallback(async (data: UserRegisterDTO) => {
    data.password = await encode(data.password);
    const response = await request(
      '/api/register/user/',
      {
        method: 'post',
        body: JSON.stringify(data),
      },
      { successNotify: true },
    );
    const userData: UserResponseDTO = response?.data;
    if (userData) {
      setUser(userData);
    }
  }, []);

  return {
    user,
    register,
  };
};
