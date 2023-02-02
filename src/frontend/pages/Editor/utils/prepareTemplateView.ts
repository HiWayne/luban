import { NodeAST } from '@/frontend/types';
import { createUniqueId } from './createUniqueId';
import {
  addConfigToMap,
  addNodeASTToMap,
} from './highPerformanceStructureOfEditor';
import { iterateNodeAST } from './operateNodeAST';

export const prepareTemplateView = (
  view: NodeAST[],
  config: Record<number, any>,
  targetId: number,
) => {
  const oldNewMap = new Map<number, number>();
  view.forEach((node) => {
    if (node) {
      iterateNodeAST(node, (nodeAST) => {
        const oldId = nodeAST.id;
        const newId = createUniqueId();
        nodeAST.id = newId;
        const oldParentId = oldNewMap.get(nodeAST.parent!);
        nodeAST.parent = oldParentId !== undefined ? oldParentId : targetId;
        oldNewMap.set(oldId, newId);
        addNodeASTToMap(nodeAST);
        addConfigToMap(nodeAST.id, config[oldId]);
      });
    }
  });
  return view;
};
