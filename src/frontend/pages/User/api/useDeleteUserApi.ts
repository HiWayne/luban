import { useCallback } from 'react';
import { request } from '@/frontend/utils';

export const useDeleteUserApi = () => {
  const deleteUser = useCallback(() => {
    return request(
      '/api/delete/user/',
      { method: 'delete' },
      { successNotify: false },
    );
  }, []);

  return {
    deleteUser,
  };
};
