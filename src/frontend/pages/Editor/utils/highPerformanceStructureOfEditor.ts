import { cloneDeep } from 'lodash-es';
import { message } from 'antd';
import { NodeAST } from '@/frontend/types';
import { iterateNodeAST, remove } from './operateNodeAST';
import { createResetId } from './prepareNodeAST';
import { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import { toCComponents } from '../ToCEditor';

const nodeASTMap = new Map<number, NodeAST>();

export const setNodeASTMap = (id: number, nodeAST: NodeAST) => {
  nodeASTMap.set(id, nodeAST);
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

export const clearNodeASTMap = () => {
  nodeASTMap.forEach((_, key) => {
    nodeASTMap.delete(key);
  });
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

export const clearNodeConfigMap = () => {
  nodeConfigMap.forEach((_, key) => {
    nodeConfigMap.delete(key);
  });
};

export const copyNodeASTToParentInMap = (id: number) => {
  const nodeAST = findNodeASTById(id);
  if (nodeAST) {
    const copiedNodeAST = cloneDeep(nodeAST);
    const resetId = createResetId();
    const parent = findNodeASTById(nodeAST.parent!);
    if (parent) {
      iterateNodeAST(copiedNodeAST, (n) => {
        const { oldId, newId } = resetId(n, nodeAST.parent as number);
        const config = findConfigFromMap(oldId);
        addNodeASTToMap(n);
        addConfigToMap(newId, cloneDeep(config));
      });
      setNodeASTMap(nodeAST.parent!, {
        ...parent!,
        children: [...parent!.children!, copiedNodeAST],
      } as any);
      return copiedNodeAST;
    } else {
      message.error('父组件不存在');
    }
  } else {
    message.error('目标组件不存在');
  }
};

export const getComponentOfNodeAST = (data: number | NodeAST) => {
  const nodeASTType =
    typeof data === 'number' ? findNodeASTById(data)?.type : data?.type;
  if (nodeASTType) {
    const targetComponent: ToCComponentMeta | undefined = toCComponents.find(
      (component) => component.type === nodeASTType,
    );
    return targetComponent || null;
  } else {
    return null;
  }
};

export const findConvergentNodeAST = (id: number): NodeAST | null => {
  const nodeAST = findNodeASTById(id);
  if (nodeAST) {
    if (nodeAST.convergent) {
      return nodeAST;
    } else {
      const parentId = nodeAST.parent;
      if (parentId !== null) {
        return findConvergentNodeAST(parentId);
      }
      return null;
    }
  } else {
    return null;
  }
};

export const findChildrenOfNodeAST = (nodeAST: NodeAST): NodeAST[] | null => {
  if (nodeAST.children) {
    return nodeAST.children;
  } else if ((nodeAST.props as any)?.renderItem?.render) {
    return [(nodeAST.props as any).renderItem.render];
  } else {
    return null;
  }
};
