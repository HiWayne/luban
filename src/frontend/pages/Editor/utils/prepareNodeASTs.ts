import { NodeAST } from '@/frontend/types';
import { createUniqueId } from './createUniqueId';
import {
  addConfigToMap,
  addNodeASTToMap,
} from './highPerformanceStructureOfEditor';
import { iterateNodeAST } from './operateNodeAST';

export const createResetId = () => {
  const oldNewMap = new Map<number, number>();
  return (nodeAST: NodeAST, targetId: number) => {
    const oldId = nodeAST.id;
    const newId = createUniqueId();
    nodeAST.id = newId;
    const oldParentId = oldNewMap.get(nodeAST.parent!);
    nodeAST.parent = oldParentId !== undefined ? oldParentId : targetId;
    oldNewMap.set(oldId, newId);
    return { oldId, newId, oldParentId, newParentId: nodeAST.parent, nodeAST };
  };
};

export const prepareNodeASTs = (
  view: NodeAST,
  config: Record<number, any>,
  targetId: number,
) => {
  const resetId = createResetId();

  if (view) {
    iterateNodeAST(view, (nodeAST) => {
      const oldId = nodeAST.id;
      resetId(nodeAST, targetId);
      addNodeASTToMap(nodeAST);
      console.log(oldId, nodeAST.id, view);
      addConfigToMap(nodeAST.id, config[oldId]);
    });
  }

  return view;
};
