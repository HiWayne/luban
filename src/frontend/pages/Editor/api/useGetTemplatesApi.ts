import { useCallback, useMemo } from 'react';
import {
  GetTemplatesRequestDTO,
  TemplateBriefResponseDTO,
  TemplateDetailResponseDTO,
} from '@/backend/service/templateService/types';
import { request } from '@/frontend/utils';
import { usePagination } from '@/frontend/hooks';

export const useGetTemplatesApi = () => {
  const getTemplateDetail = useCallback(async (id: string) => {
    const response = await request<TemplateDetailResponseDTO>(
      `/api/get/template/detail/?id=${id}`,
    );
    if (response && response.data) {
      return response.data;
    } else {
      return null;
    }
  }, []);

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
  } = usePagination<TemplateBriefResponseDTO>(fetcher);

  const templates = useMemo(() => response?.list || [], [response]);

  return {
    templates,
    getTemplates,
    getTemplateDetail,
    loading,
    more,
  };
};
