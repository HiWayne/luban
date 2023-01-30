import { useCallback, useState } from 'react';
import shallow from 'zustand/shallow';
import { request, RequestConfig } from '@/frontend/utils';
import useStore from '@/frontend/store';

export const useQueryUserApi = (requestConfig?: RequestConfig) => {
  const [user, setUser] = useStore(
    (store) => [store.user.user, store.user.setUser],
    shallow,
  );
  const [queriedUser, setQueriedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryOwnUser = useCallback(async () => {
    setLoading(true);
    const response = await request(
      `/api/get/user/`,
      undefined,
      requestConfig,
    ).finally(() => {
      setLoading(false);
    });
    const userData = response?.data;
    if (userData) {
      setUser(userData);
    }
  }, []);

  const queryUserById = useCallback(async (id: number) => {
    setLoading(true);
    const response = await request(`/api/get/user/?id=${id}`).finally(() => {
      setLoading(false);
    });
    const userData = response?.data;
    if (userData) {
      setQueriedUser(userData);
    }
  }, []);

  return {
    user,
    queriedUser,
    loading,
    queryOwnUser,
    queryUserById,
  };
};
