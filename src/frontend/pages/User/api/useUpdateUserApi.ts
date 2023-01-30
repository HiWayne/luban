import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import { UserRegisterDTO } from '@/backend/service/userService/types';
import { request } from '@/frontend/utils';
import useStore from '@/frontend/store';

export const useUpdateUserApi = () => {
  const [user, setUser] = useStore(
    (store) => [store.user.user, store.user.setUser],
    shallow,
  );

  const updateUser = useCallback(
    async (data: Partial<UserRegisterDTO> & { id: number }) => {
      const response = await request(
        '/api/update/user/',
        {
          method: 'put',
          body: JSON.stringify(data),
        },
        { successNotify: true },
      );
      if (response && response.data) {
        setUser(response.data);
      }
    },
    [],
  );

  return {
    user,
    updateUser,
  };
};
