import { useCallback, useState } from 'react';
import { CategoryResponseDTO } from '@/backend/service/deployService/types';
import { usePagination } from '@/frontend/hooks';
import { request } from '@/frontend/utils';

export const useGetDeployCategoriesApi = () => {
  const [categories, setList] = useState<CategoryResponseDTO[]>([]);

  const fetcher = useCallback(
    async (page: number, params?: { start?: string; limit?: string }) => {
      const response = await request(
        `/api/category/list/${
          params
            ? `?${new URLSearchParams({
                start: `${(page - 1) * (Number(params.limit) || 25)}`,
                limit: `${params.limit || 25}`,
              })}`
            : `?${new URLSearchParams({
                start: `${(page - 1) * 25}`,
                limit: '25',
              })}`
        }`,
      );
      setList((list) => [...list, ...response.data.list]);
      return response.data;
    },
    [],
  );

  const {
    fetch: getDeployCategories,
    loading,
    more,
    reset: _reset,
  } = usePagination<CategoryResponseDTO>(fetcher);

  const reset = useCallback(() => {
    _reset();
    setList([]);
  }, []);

  return {
    categories,
    getDeployCategories,
    loading,
    more,
    fetcher,
    reset,
  };
};
