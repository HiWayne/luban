import { useCallback, useMemo } from 'react';
import {
  GetTemplatesRequestDTO,
  TemplateResponseDTO,
} from '@/backend/service/templateService/types';
import { request } from '@/frontend/utils';
import { usePagination } from '@/frontend/hooks';

export const useGetTemplatesApi = () => {
  const fetcher = useCallback(
    async (page: number, params: GetTemplatesRequestDTO) => {
      const response = await request(
        `/api/get/templates/${
          params
            ? `?${new URLSearchParams({
                ...params,
                start: `${(page - 1) * 25}`,
              })}`
            : `?${new URLSearchParams({
                start: `${(page - 1) * 25}`,
              })}`
        }`,
      );
      return response.data;
    },
    [],
  );

  const {
    response,
    fetch: getTemplates,
    loading,
    more,
  } = usePagination<TemplateResponseDTO>(fetcher);

  const templates = useMemo(() => response?.list || [], [response]);

  return {
    templates,
    getTemplates,
    loading,
    more,
  };
};
