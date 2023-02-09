import { useCallback, useRef, useState } from 'react';
import shallow from 'zustand/shallow';
import { request, RequestConfig } from '@/frontend/utils';
import useStore from '@/frontend/store';

export const useQueryUserApi = (requestConfig?: RequestConfig) => {
  const [user, setUser] = useStore(
    (store) => [store.user.user, store.user.setUser],
    shallow,
  );
  const [queriedUser, setQueriedUser] = useState(null);
  const [ownLoading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const ownLoadingRef = useRef(false);
  const queryLoadingRef = useRef(false);

  const queryOwnUser = useCallback(async () => {
    setLoading(true);
    ownLoadingRef.current = true;
    const response = await request(
      `/api/get/user/`,
      undefined,
      requestConfig,
    ).finally(() => {
      setLoading(false);
      ownLoadingRef.current = false;
    });
    const userData = response?.data;
    if (userData) {
      setUser(userData);
    }
  }, []);

  const queryUserById = useCallback(async (id: number) => {
    setQueryLoading(true);
    queryLoadingRef.current = true;
    const response = await request(`/api/get/user/?id=${id}`).finally(() => {
      setQueryLoading(false);
      queryLoadingRef.current = false;
    });
    const userData = response?.data;
    if (userData) {
      setQueriedUser(userData);
    }
  }, []);

  return {
    user,
    queriedUser,
    ownLoading,
    ownLoadingRef,
    queryLoading,
    queryLoadingRef,
    queryOwnUser,
    queryUserById,
  };
};
