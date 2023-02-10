import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { loadMicroApp, MicroApp } from 'qiankun';
import { isExist } from '@duitang/dt-base';
import { Button, Card, Form, Input, message, notification } from 'antd';
import shallow from 'zustand/shallow';
import { getRandomString } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { PageModel } from '@/backend/types';
import { Flex } from '@/frontend/components';
import * as compileFunctions from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/plugins';
import type { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import { ConfigPanel, TemplateConfig } from '../components';
import {
  BasicComponents,
  PreviewSourceCode,
  TemplateMarket,
  SimulateReal,
} from './components';
import useStore from '@/frontend/store';
import { useCreateTemplateApi } from '../api';
import { SaveTemplateRequestDTO } from '@/backend/service/templateService/types';
import { useEditorInteractive } from '../hooks';
import { request } from '@/frontend/utils';
import {
  addConfigToMap,
  addNodeASTToMap,
  createUniqueId,
  getComponentOfNodeAST,
} from '../utils';
import { NodeAST } from '@/frontend/types';
import { OutputPageArea } from './components/OutputPageArea';
import { DragContext } from './DragProvider';

export const toCComponents = Object.values(compileFunctions)
  .map((compileFunction) => (compileFunction as any).meta as ToCComponentMeta)
  .sort((a, b) => a.sort - b.sort);

export const KEY = 'lubanApp';

const ToCEditor = ({ type }: { type: 'page' | 'template' }) => {
  const { pageModel, currentComponent, setPageMeta } = useStore(
    (state) => ({
      pageModel: state.editor.pageModel,
      currentComponent: state.editor.currentChooseComponent,
      setPageMeta: state.editor.setPageMeta,
    }),
    shallow,
  );

  const [title, setTitle] = useState('未命名');
  const [sourceCode, setSourceCode] = useState('');
  const [templateConfigShow, setTemplateConfigShow] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);
  const controllerRef: MutableRefObject<AbortController | null> = useRef(null);

  const usedForPage = useMemo(() => type === 'page', [type]);

  const { createTemplate } = useCreateTemplateApi();

  const { onDragStart, onDragEnd, onDragOver, onDrop } =
    useEditorInteractive(updateCount);

  useEffect(() => {
    const addNodeInStore = useStore.getState().editor.addNodeAST;
    const view = useStore.getState().editor.pageModel.view;
    if (!view) {
      const rootNodeAST: NodeAST = {
        id: createUniqueId(),
        parent: null,
        type: 'BasicContainer',
        props: {},
        children: [],
      };
      // 在store中添加
      addNodeInStore(rootNodeAST);
      // 在高性能nodeAST数据结构中添加
      addNodeASTToMap(rootNodeAST);
      // 在nodeAST配置缓存添加
      const component = getComponentOfNodeAST(rootNodeAST.id);
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
    }
  }, []);

  useEffect(() => {
    setPageMeta({
      key: KEY,
      title,
    });
  }, [title]);

  const previewPage = useCallback(async () => {
    if (!pageModel.view) {
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    const { signal } = controller;

    controllerRef.current = controller;

    const suffix = getRandomString();
    const randomKey = `${KEY}${suffix}`;
    const tempPageModel: PageModel = {
      ...pageModel,
      meta: { ...pageModel.meta },
    };
    tempPageModel.meta.key = randomKey;
    const data = await request(
      '/api/generatePage/',
      {
        method: 'post',
        body: JSON.stringify(tempPageModel),
        signal,
      },
      { errorNotify: false },
    );
    if (data && data.data) {
      const htmlPath = data.data.htmlPath;
      if (htmlPath) {
        if (microAppRef.current) {
          microAppRef.current.unmount();
        }
        microAppRef.current = loadMicroApp({
          name: `luban-app-${randomKey}`,
          entry: `${htmlPath}`,
          container: '#lubanAppContainer-development',
          props: {
            setUpdateCount: () => setUpdateCount((count) => count + 1),
          },
        });
      }
    }
  }, [pageModel]);

  useEffect(() => {
    previewPage();
  }, [pageModel]);

  const deploy = useCallback(async () => {
    if (!pageModel.view) {
      message.error('页面内容不能为空');
      return;
    }
    const tempPageModel: PageModel = {
      ...pageModel,
      meta: { ...pageModel.meta },
    };
    tempPageModel.meta.mode = 'deploy';
    const data: any = await fetch('/api/generatePage/', {
      method: 'post',
      body: JSON.stringify(tempPageModel),
    });
    console.log(data);
  }, [pageModel]);

  const getReactCode = useCallback(async () => {
    const code = await fetch('/api/compileToSourceCode/', {
      method: 'post',
      body: JSON.stringify(pageModel),
    })
      .then((response) => response.json())
      .then((json) => json.data);
    setSourceCode(code);
  }, [pageModel]);

  const openTemplateConfigModal = useCallback(() => {
    setTemplateConfigShow(true);
  }, []);

  const closeTemplateConfigModal = useCallback(() => {
    setTemplateConfigShow(false);
  }, []);

  const createTemplateAndCloseModal = useCallback(
    async (templateData: SaveTemplateRequestDTO) => {
      const result = await createTemplate(templateData);
      if (result) {
        closeTemplateConfigModal();
      } else {
        notification.error({
          message: '创建模板失败',
        });
      }
    },
    [],
  );

  const dragContextValue = useMemo(
    () => ({ onDragStart, onDragEnd, onDragOver }),
    [],
  );

  return (
    <DragContext.Provider value={dragContextValue}>
      <Flex
        style={{
          width: '100vw',
          gap: '80px',
        }}
        alignItems="flex-start">
        <div style={{ flex: '0 0 400px', height: '100vh', overflow: 'auto' }}>
          {usedForPage ? (
            <Form style={{ margin: '24px 0 0 24px' }}>
              <Form.Item label="页面标题">
                <Input
                  style={{ width: '200px' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>
            </Form>
          ) : null}
          {usedForPage ? null : (
            <Card style={{ marginTop: '20px' }}>
              <BasicComponents />
            </Card>
          )}
          <div style={{ marginTop: '20px' }}>
            {usedForPage ? null : (
              <Button
                type="primary"
                style={{ marginLeft: '20px' }}
                onClick={openTemplateConfigModal}>
                保存为模板
              </Button>
            )}
            {usedForPage ? (
              <Button
                type="primary"
                style={{ marginLeft: '20px' }}
                onClick={deploy}>
                发布
              </Button>
            ) : null}
          </div>
          <Card style={{ marginTop: '20px' }}>
            <TemplateMarket />
          </Card>
          {usedForPage ? (
            <Card style={{ marginTop: '20px' }}>
              <BasicComponents />
            </Card>
          ) : null}
        </div>
        <Flex
          style={{ flex: '0 0 auto' }}
          direction="column"
          justifyContent="center"
          alignItems="flex-end">
          <Flex alignItems="center" style={{ marginBottom: '12px' }}>
            {usedForPage ? (
              <PreviewSourceCode
                sourceCode={sourceCode}
                setSourceCode={setSourceCode}
                getReactCode={getReactCode}
              />
            ) : null}
            <SimulateReal />
          </Flex>
          <OutputPageArea mode="development" />
        </Flex>
        <ConfigPanel data={currentComponent} onDrop={onDrop} />
        <TemplateConfig
          open={templateConfigShow}
          onOk={createTemplateAndCloseModal}
          onCancel={closeTemplateConfigModal}
          type="create"
        />
      </Flex>
    </DragContext.Provider>
  );
};

export default ToCEditor;
