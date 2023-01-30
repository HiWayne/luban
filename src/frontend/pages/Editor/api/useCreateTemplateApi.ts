import { useCallback } from 'react';
import { SaveTemplateRequestDTO } from '@/backend/service/templateService/types';
import { request } from '@/frontend/utils';

export const useCreateTemplateApi = () => {
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

  return {
    createTemplate,
  };
};
