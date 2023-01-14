import { useCallback } from 'react';
import { message } from 'antd';
import { isExist } from '@duitang/dt-base';
import useStore from '@/frontend/store';
import {
  addConfigToMap,
  addNodeASTToMap,
  createUniqueId,
  removeConfigFromMap,
  removeNodeASTFromMap,
  updateConfigFromMap,
} from '../utils';
import { ToCComponent } from '../config';

export const useUpdateNodeAST = (data: ToCComponent) => {
  const addNodeAST = useCallback(() => {
    message.success('成功添加模块');
    const id = createUniqueId();
    const { addNodeAST: addNodeInStore, setCurrentChooseComponent } =
      useStore.getState().editor;
    // 打开对应的配置面板
    setCurrentChooseComponent({ ...data, id });
    const nodeAST = {
      ...data.defaultAST,
      id,
    };
    // 在store中添加
    addNodeInStore(nodeAST);
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
    }
  }, []);

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
      // 在nodeAST配置缓存更新
      updateConfigFromMap(id, configs);
    },
    [],
  );

  const removeNodeAST = useCallback((id: number) => {
    const removeNodeASTInStore = useStore.getState().editor.removeNodeAST;
    // 在store中删除
    removeNodeASTInStore(id);
    // 高性能nodeAST数据结构中删除
    removeNodeASTFromMap(id);
    // 在nodeAST配置缓存中删除
    removeConfigFromMap(id);
  }, []);

  return {
    addNodeAST,
    updateNodeAST,
    removeNodeAST,
  };
};
