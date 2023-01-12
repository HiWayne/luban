import { NodeAST } from '@/backend/types/frontstage';

const nodeASTMap = new Map<number, NodeAST>();

export const addNodeASTToMap = (nodeAST: NodeAST) => {
  nodeASTMap.set(nodeAST.id, nodeAST);
};

export const findNodeASTById = (id: number) => {
  return nodeASTMap.get(id);
};

export const removeNodeASTFromMap = (id: number) => {
  nodeASTMap.delete(id);
};

const nodeConfigMap = new Map<number, Record<string, any>>();

export const addConfigToMap = (id: number, configs: Record<string, any>) => {
  nodeConfigMap.set(id, configs);
};

export const updateConfigFromMap = (
  id: number,
  configs:
    | string
    | number
    | Record<string, any>
    | ((oldConfig: Record<string, any> | undefined) => Record<string, any>),
  propName?: string,
) => {
  const oldConfigs = nodeConfigMap.get(id);
  if (!propName) {
    let newConfigs = configs;
    if (oldConfigs && typeof oldConfigs === 'object') {
      newConfigs = { ...oldConfigs, configs };
    }
    nodeConfigMap.set(id, newConfigs as Record<string, any>);
  } else if (typeof configs === 'function') {
    if (oldConfigs) {
      const newSingleConfig = configs({ ...oldConfigs[propName] });
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
