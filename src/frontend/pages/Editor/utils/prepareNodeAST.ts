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

export const prepareNodeAST = (
  view: NodeAST,
  config: Record<number, any>,
  targetId: number,
) => {
  const resetId = createResetId();
  const newConfig: Record<number, any> = {};

  if (view) {
    iterateNodeAST(view, (nodeAST) => {
      const oldId = nodeAST.id;
      const { newId } = resetId(nodeAST, targetId);
      addNodeASTToMap(nodeAST);
      addConfigToMap(nodeAST.id, config[oldId]);
      newConfig[newId] = config[oldId];
    });
  }

  return { view, config: newConfig };
};
