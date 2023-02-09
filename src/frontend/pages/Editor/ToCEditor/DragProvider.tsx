import { createContext } from 'react';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { TemplateDetailResponseDTO } from '@/backend/service/templateService/types';

export const DragContext = createContext<{
  onDragStart: (
    event: DragEvent,
    data?: ToCComponent | Promise<TemplateDetailResponseDTO | null>,
  ) => void;
  onDragEnd: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
} | null>(null);
