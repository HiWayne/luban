import { useCallback } from 'react';
import { cloneDeep } from 'lodash-es';
import { message } from 'antd';
import { isExist } from '@duitang/dt-base';
import useStore from '@/frontend/store';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import {
  addConfigToMap,
  addNodeASTToMap,
  createUniqueId,
  prepareTemplateView,
  removeConfigFromMap,
  removeNodeASTFromMap,
  setNodeASTMap,
  updateConfigFromMap,
  updateNodeASTFromMap,
} from '../utils';
import { NodeAST } from '@/frontend/types';
import { findPathById, iterateNodeAST } from '../utils/operateNodeAST';

export const useModifyPage = () => {
  const addComponentFromExist = useCallback(
    (nodeAST: NodeAST, config: any, targetId?: number) => {
      const { addNodeAST: addNodeInStore, pageModel } =
        useStore.getState().editor;
      nodeAST = {
        ...nodeAST,
        parent: targetId !== undefined ? targetId : pageModel.view.id,
      };
      // 在store中添加
      addNodeInStore(nodeAST, targetId);
      // 在高性能nodeAST数据结构中添加
      addNodeASTToMap(nodeAST);
      // 在nodeAST配置缓存添加
      addConfigToMap(nodeAST.id, config);
    },
    [],
  );

  const addComponentFromInitial = useCallback(
    (data: ToCComponent, targetId?: number) => {
      message.success(`成功添加【${data.name}】组件`, 2);
      const id = createUniqueId();
      const {
        addNodeAST: addNodeInStore,
        setCurrentChooseComponent,
        pageModel,
      } = useStore.getState().editor;
      const nodeAST = {
        ...data.defaultAST,
        id,
        parent: targetId !== undefined ? targetId : pageModel.view.id,
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

  const addComponentFromTemplate = useCallback(
    (view: NodeAST[], config: Record<number, any>, target?: number) => {
      const { addNodeAST: addNodeInStore, pageModel } =
        useStore.getState().editor;
      const templateNodeASTs = prepareTemplateView(
        view,
        config,
        target !== undefined ? target : pageModel.view.id,
      );
      addNodeInStore(cloneDeep(templateNodeASTs));
      message.success('成功添加模板', 2);
    },
    [],
  );

  const updateComponent = useCallback(
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

  const removeComponent = useCallback((id: number) => {
    const { pageModel, removeNodeAST: removeNodeASTInStore } =
      useStore.getState().editor;
    const { complete, nodes } = findPathById(pageModel.view, id);
    if (complete) {
      iterateNodeAST(nodes[0], (nodeAST) => {
        // 在高性能nodeAST数据结构中删除
        removeNodeASTFromMap(nodeAST.id);
        // 在nodeAST配置缓存中删除
        removeConfigFromMap(nodeAST.id);
      });
      // 在store中删除
      removeNodeASTInStore(id);
    }
  }, []);

  const moveComponent = useCallback((nodeAST: NodeAST, targetId: number) => {
    const {
      addNodeAST: addNodeASTInStore,
      removeNodeAST: removeNodeASTInStore,
    } = useStore.getState().editor;
    const newNodeAST = { ...nodeAST, parent: targetId };
    removeNodeASTInStore(newNodeAST.id);
    addNodeASTInStore(newNodeAST, targetId);
    setNodeASTMap(newNodeAST.id, newNodeAST);
  }, []);

  return {
    addComponentFromExist,
    addComponentFromInitial,
    addComponentFromTemplate,
    updateComponent,
    removeComponent,
    moveComponent,
  };
};
