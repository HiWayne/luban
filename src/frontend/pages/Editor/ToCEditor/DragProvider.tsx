import { createContext } from 'react';
import { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import { TemplateDetailResponseDTO } from '@/backend/service/templateService/types';

export const DragContext = createContext<{
  onDragStart: (
    event: DragEvent,
    data?: ToCComponentMeta | Promise<TemplateDetailResponseDTO | null>,
  ) => void;
  onDragEnd: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
} | null>(null);
