import { useCallback } from 'react';
import { SaveTemplateRequestDTO } from '@/backend/service/templateService/types';
import { request } from '@/frontend/utils';

export const useEditTemplateApi = () => {
  const createTemplate = useCallback(
    async (templateData: SaveTemplateRequestDTO) => {
      const response = await request(
        '/api/create/template/',
        {
          method: 'post',
          body: JSON.stringify(templateData),
        },
        { successNotify: true },
      );
      return response.data;
    },
    [],
  );

  const updateTemplate = useCallback(
    async (id: string, templateData: SaveTemplateRequestDTO) => {
      const response = await request(
        '/api/update/template/',
        {
          method: 'put',
          body: JSON.stringify({ ...templateData, id }),
        },
        { successNotify: true },
      );
      return response.data;
    },
    [],
  );

  return {
    createTemplate,
    updateTemplate,
  };
};
