import { NodeAST } from '@/backend/types/frontstage';
import { createUniqueId } from './createUniqueId';

export const formatTemplateView = (view: NodeAST[]) => {
  view.forEach((node) => {
    if (node) {
      node.id = createUniqueId();
      if (Array.isArray(node.children)) {
        formatTemplateView(node.children);
      }
      if ((node?.props as any)?.renderItem?.render) {
        formatTemplateView((node?.props as any)?.renderItem?.render);
      }
    }
  });
  return view;
};
