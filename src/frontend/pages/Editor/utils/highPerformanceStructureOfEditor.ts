import { cloneDeep } from 'lodash-es';
import { NodeAST } from '@/frontend/types';
import { remove } from './operateNodeAST';

const nodeASTMap = new Map<number, NodeAST>();

export const setNodeASTMap = (id: number, nodeAST: NodeAST) => {
  nodeASTMap.set(id, cloneDeep(nodeAST));
};

export const addNodeASTToMap = (nodeAST: NodeAST) => {
  setNodeASTMap(nodeAST.id, nodeAST);
};

export const findNodeASTById = (id: number) => {
  return nodeASTMap.get(id);
};

export const updateNodeASTFromMap = (id: number, newProps: any) => {
  if (newProps) {
    const oldNodeAST = findNodeASTById(id);
    if (oldNodeAST) {
      const newNodeAST = { ...oldNodeAST };
      newNodeAST.props = oldNodeAST.props
        ? { ...oldNodeAST.props, ...newProps }
        : newProps;
      setNodeASTMap(oldNodeAST.id, newNodeAST);
    }
  }
};

export const removeNodeASTFromMap = (id: number) => {
  const nodeAST = findNodeASTById(id);
  if (nodeAST) {
    nodeASTMap.delete(id);
    const parentId = nodeAST.parent;
    if (parentId !== null) {
      const parentNodeAST = findNodeASTById(parentId);
      if (parentNodeAST) {
        remove(parentNodeAST, id);
        setNodeASTMap(parentId, parentNodeAST);
      }
    }
  }
};

const nodeConfigMap = new Map<number, Record<string, any>>();

export const addConfigToMap = (id: number, configs: Record<string, any>) => {
  nodeConfigMap.set(id, configs);
};

export const updateConfigFromMap = (
  id: number,
  configs:
    | Record<string, any>
    | ((oldConfig: Record<string, any> | undefined) => Record<string, any>),
) => {
  const oldConfigs = nodeConfigMap.get(id);
  if (typeof configs !== 'function') {
    let newConfigs = configs;
    if (oldConfigs && typeof oldConfigs === 'object') {
      newConfigs = { ...oldConfigs, ...configs };
    }
    nodeConfigMap.set(id, newConfigs as Record<string, any>);
  } else if (typeof configs === 'function') {
    if (oldConfigs) {
      const newSingleConfig = configs({ ...oldConfigs });
      const newConfigs = { ...oldConfigs, ...newSingleConfig };
      nodeConfigMap.set(id, newConfigs);
    } else {
      const newSingleConfig = configs({});
      nodeConfigMap.set(id, newSingleConfig);
    }
  }
};

export const removeConfigFromMap = (id: number) => {
  nodeConfigMap.delete(id);
};

export const findConfigFromMap = (id: number, propName?: string) => {
  if (propName) {
    const configs = nodeConfigMap.get(id);
    return configs ? configs[propName] : undefined;
  } else {
    return nodeConfigMap.get(id);
  }
};
