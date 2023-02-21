import { useCallback } from 'react';
import { cloneDeep } from 'lodash-es';
import { message } from 'antd';
import { isExist } from '@duitang/dt-base';
import useStore from '@/frontend/store';
import { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import {
  addConfigToMap,
  addNodeASTToMap,
  createUniqueId,
  idReturnToZero,
  getComponentOfNodeAST,
  prepareNodeAST,
  removeConfigFromMap,
  removeNodeASTFromMap,
  setNodeASTMap,
  updateConfigFromMap,
  updateNodeASTFromMap,
  clearNodeASTMap,
  clearNodeConfigMap,
  createRootNodeAST,
} from '../utils';
import { NodeAST } from '@/frontend/types';
import { findPathById, iterateNodeAST } from '../utils/operateNodeAST';
import { TemplateDetailResponseDTO } from '@/backend/service/templateService/types';

export const useModifyPage = () => {
  const addComponentFromInitial = useCallback(
    (data: ToCComponentMeta, targetId?: number) => {
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
    (templateDetail: TemplateDetailResponseDTO, targetId?: number) => {
      const { view, config, name } = templateDetail;
      const {
        addNodeAST: addNodeInStore,
        pageModel,
        setCurrentChooseComponent,
      } = useStore.getState().editor;
      const { view: templateNodeAST, config: newConfig } = prepareNodeAST(
        view,
        config,
        targetId !== undefined ? targetId : pageModel.view.id,
      );
      const clonedTemplateNodeAST = cloneDeep(templateNodeAST);
      addNodeInStore(clonedTemplateNodeAST, targetId);
      message.success(`成功使用【${name}】模板`, 2);
      const component = getComponentOfNodeAST(clonedTemplateNodeAST);
      if (component) {
        // 打开对应的配置面板
        setCurrentChooseComponent({
          component: { ...component, id: clonedTemplateNodeAST.id },
          config: newConfig[clonedTemplateNodeAST.id],
        });
      }
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
    const targetComponent = getComponentOfNodeAST(nodeAST);
    if (targetComponent) {
      message.success(`成功移动【${targetComponent.name}】组件`, 2);
    }
  }, []);

  const copyComponentToParent = useCallback((id: number) => {
    const { copyNodeASTToParent } = useStore.getState().editor;
    copyNodeASTToParent(id);
  }, []);

  const resetPage = useCallback(() => {
    const { addNodeAST, clearAllNodeAST } = useStore.getState().editor;
    idReturnToZero.method();
    clearNodeASTMap();
    clearNodeConfigMap();
    clearAllNodeAST();
    const rootNodeAST = createRootNodeAST();
    // 在store中添加
    addNodeAST(rootNodeAST);
    // 在高性能nodeAST数据结构中添加
    addNodeASTToMap(rootNodeAST);
    // 在nodeAST配置缓存添加
    const component = getComponentOfNodeAST(rootNodeAST);
    if (component) {
      if (Array.isArray(component.configs)) {
        const defaultConfigs = component.configs.reduce((configs, config) => {
          if (isExist(config.defaultConfig)) {
            configs[config.propName] = config.defaultConfig;
          }
          return configs;
        }, {} as any);
        addConfigToMap(rootNodeAST.id, defaultConfigs);
      }
    }
  }, []);

  return {
    addComponentFromInitial,
    addComponentFromTemplate,
    updateComponent,
    removeComponent,
    moveComponent,
    copyComponentToParent,
    resetPage,
  };
};
