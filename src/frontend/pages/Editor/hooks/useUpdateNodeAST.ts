import { useCallback } from 'react';
import { message } from 'antd';
import { isExist } from '@duitang/dt-base';
import useStore from '@/frontend/store';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import {
  addConfigToMap,
  addNodeASTToMap,
  createUniqueId,
  removeConfigFromMap,
  removeNodeASTFromMap,
  updateConfigFromMap,
  updateNodeASTFromMap,
} from '../utils';
import { NodeAST } from '@/frontend/types';
import { findPathById, iterateNodeAST } from '../utils/operateNodeAST';

export const useUpdateNodeAST = () => {
  const addNodeASTFromExist = useCallback(
    (nodeAST: NodeAST, config: any, targetId?: number) => {
      const { addNodeAST: addNodeInStore } = useStore.getState().editor;
      // 在store中添加
      addNodeInStore(nodeAST, targetId);
      // 在高性能nodeAST数据结构中添加
      addNodeASTToMap(nodeAST);
      // 在nodeAST配置缓存添加
      addConfigToMap(nodeAST.id, config);
    },
    [],
  );

  const addNodeASTFromInitial = useCallback(
    (data: ToCComponent, targetId?: number) => {
      message.success(`成功添加【${data.name}】组件`, 2);
      const id = createUniqueId();
      const { addNodeAST: addNodeInStore, setCurrentChooseComponent } =
        useStore.getState().editor;
      const nodeAST = {
        ...data.defaultAST,
        id,
      };
      // 在store中添加
      addNodeInStore(nodeAST, targetId);
      // 在高性能nodeAST数据结构中添加
      addNodeASTToMap(nodeAST);
      // 在nodeAST配置缓存添加
      if (Array.isArray(data.configs)) {
        const defaultConfigs = data.configs.reduce((configs, config) => {
          if (isExist(config.defaultConfig)) {
            configs[config.propName] = config.defaultConfig;
          }
          return configs;
        }, {} as any);
        addConfigToMap(id, defaultConfigs);
        // 打开对应的配置面板
        setCurrentChooseComponent({
          component: { ...data, id },
          config: defaultConfigs,
        });
      }
    },
    [],
  );

  const updateNodeAST = useCallback(
    (
      id: number,
      props:
        | Record<string, any>
        | ((old: Record<string, any> | undefined) => Record<string, any>),
      configs:
        | Record<string, any>
        | ((old: Record<string, any> | undefined) => Record<string, any>),
    ) => {
      const updateInStore = useStore.getState().editor.updateNodeAST;
      // 在store中更新
      updateInStore(id, props);
      // 在高性能nodeAST数据结构中更新
      updateNodeASTFromMap(id, props);
      // 在nodeAST配置缓存更新
      updateConfigFromMap(id, configs);
    },
    [],
  );

  const removeNodeAST = useCallback((id: number) => {
    const { pageModel, removeNodeAST: removeNodeASTInStore } =
      useStore.getState().editor;
    const { complete, nodes } = findPathById(pageModel.view, id);
    if (complete) {
      // 在store中删除
      removeNodeASTInStore(id);
      iterateNodeAST(nodes[0], (nodeAST) => {
        // 在高性能nodeAST数据结构中删除
        removeNodeASTFromMap(nodeAST.id);
        // 在nodeAST配置缓存中删除
        removeConfigFromMap(nodeAST.id);
      });
    }
  }, []);

  return {
    addNodeASTFromExist,
    addNodeASTFromInitial,
    updateNodeAST,
    removeNodeAST,
  };
};
