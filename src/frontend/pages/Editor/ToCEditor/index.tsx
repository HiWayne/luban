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
import { Button, Card, Form, Input, message, Modal, notification } from 'antd';
import shallow from 'zustand/shallow';
import { getRandomString } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { PageModel } from '@/backend/types';
import { Flex } from '@/frontend/components';
import * as compileFunctions from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/plugins';
import type { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import {
  ConfigPanel,
  TemplateConfig,
  TemplateConfigRefProps,
} from '../components';
import {
  BasicComponents,
  PreviewSourceCode,
  TemplateMarket,
  SimulateReal,
  DeployConfig,
  DeployData,
} from './components';
import useStore from '@/frontend/store';
import { useEditTemplateApi, useGetTemplatesApi } from '../api';
import {
  SaveTemplateRequestDTO,
  TemplateDetailResponseDTO,
} from '@/backend/service/templateService/types';
import { useEditorInteractive, useModifyPage } from '../hooks';
import { request } from '@/frontend/utils';
import {
  addConfigToMap,
  addNodeASTToMap,
  createRootNodeAST,
  getComponentOfNodeAST,
} from '../utils';
import { OutputPageArea } from './components/OutputPageArea';
import { DragContext } from './DragProvider';
import { DeployRequestDTO } from '@/backend/service/deployService/types';
import { getDeployPath } from '@/frontend/utils/getDeployPath';

export const toCComponents = Object.values(compileFunctions)
  .map((compileFunction) => (compileFunction as any).meta as ToCComponentMeta)
  .sort((a, b) => a.sort - b.sort);

export const KEY = 'lubanApp';

const ToCEditor = ({ type, id }: { type: 'page' | 'template'; id: string }) => {
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
  const [templateConfigType, setTemplateConfigType] = useState<
    'create' | 'update'
  >('create');
  const [templateDetail, setTemplateDetail] =
    useState<TemplateDetailResponseDTO>();
  const [updateCount, setUpdateCount] = useState(0);
  const [openDeploy, setOpenDeploy] = useState(false);
  const [openDeploySuccess, setOpenDeploySuccess] = useState(false);

  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);
  const controllerRef: MutableRefObject<AbortController | null> = useRef(null);
  const deployDataRef: MutableRefObject<DeployData | null> = useRef(null);
  const pagePathRef = useRef('');
  const templateConfigRef = useRef<TemplateConfigRefProps>(null);

  const usedForPage = useMemo(() => type === 'page', [type]);

  const { createTemplate, updateTemplate } = useEditTemplateApi();

  const { onDragStart, onDragEnd, onDragOver, onDrop } =
    useEditorInteractive(updateCount);

  const { getTemplateDetail } = useGetTemplatesApi();
  const { addComponentFromTemplate, resetPage } = useModifyPage();

  useEffect(() => {
    if (id) {
      resetPage();
      getTemplateDetail(id).then((templateDetail) => {
        if (templateDetail) {
          setTemplateDetail(templateDetail);
          addComponentFromTemplate(templateDetail);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const addNodeInStore = useStore.getState().editor.addNodeAST;
    const view = useStore.getState().editor.pageModel.view;
    if (!view) {
      const rootNodeAST = createRootNodeAST();
      // 在store中添加
      addNodeInStore(rootNodeAST);
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
  }, [pageModel.logics, pageModel.view]);

  const fetchDeploy = useCallback(async () => {
    if (deployDataRef.current) {
      const category = deployDataRef.current.category;
      const category_name = deployDataRef.current.category_name;
      const tempPageModel: PageModel = {
        ...pageModel,
        meta: { ...pageModel.meta },
      };
      tempPageModel.meta.mode = 'deploy';
      const body: DeployRequestDTO = {
        category,
        category_name,
        pageModel: tempPageModel,
        desc: deployDataRef.current.desc,
      };
      const data = await request('/api/deploy/', {
        method: 'post',
        body: JSON.stringify(body),
      });
      if (data && data.data) {
        pagePathRef.current = `${getDeployPath(
          category,
          tempPageModel.meta.path,
        )}`;
        deployDataRef.current = null;
        setOpenDeploy(false);
        setOpenDeploySuccess(true);
      } else {
        notification.error({
          message: '发布失败',
        });
      }
    }
  }, [pageModel]);

  const deploy = useCallback(async () => {
    if (!pageModel.view) {
      message.error('页面内容不能为空');
      return;
    }
    if (!deployDataRef.current) {
      message.error('发布设置不能为空');
      return;
    }
    const category = deployDataRef.current.category;
    const path = pageModel.meta.path;
    const response = await request(
      `/api/deploy/check/?${new URLSearchParams({
        category,
        path,
      })}`,
    );
    if (response && response.data) {
      const fullPath = getDeployPath(category, path);
      Modal.confirm({
        title: '更新确认',
        content: (
          <Flex
            style={{ margin: '30px 0' }}
            direction="column"
            alignItems="flex-start">
            <a href={fullPath} type="_blank">
              {fullPath}
            </a>
            <p
              style={{
                margin: '20px 0',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              该地址已存在，确定用新内容覆盖？
            </p>
          </Flex>
        ),
        onOk: fetchDeploy,
      });
    } else {
      fetchDeploy();
    }
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

  const openTemplateConfigModal = (type: 'create' | 'update') =>
    useCallback(() => {
      setTemplateConfigShow(true);
      setTemplateConfigType(type);
      if (type === 'update') {
        templateConfigRef.current?.set(templateDetail!);
      }
    }, [templateDetail]);

  const closeTemplateConfigModal = useCallback(() => {
    setTemplateConfigShow(false);
  }, []);

  const EditTemplateAndCloseModal = useCallback(
    async (templateData: SaveTemplateRequestDTO) => {
      switch (templateConfigType) {
        case 'create':
          const createTemplateResult = await createTemplate(templateData);
          if (createTemplateResult) {
            closeTemplateConfigModal();
          } else {
            notification.error({
              message: '创建模板失败',
            });
          }
          break;
        case 'update':
          const updateTemplateResult = await updateTemplate(
            templateDetail?.id!,
            templateData,
          );
          if (updateTemplateResult) {
            closeTemplateConfigModal();
          } else {
            notification.error({
              message: '更新模板失败',
            });
          }
          break;
      }
    },
    [templateConfigType, templateDetail],
  );

  const dragContextValue = useMemo(
    () => ({ onDragStart, onDragEnd, onDragOver }),
    [],
  );

  const closeDeploySuccessModal = useCallback(() => {
    setOpenDeploySuccess(false);
    pagePathRef.current = '';
  }, []);

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
              <>
                {!templateDetail ? (
                  <Button
                    type="primary"
                    style={{ marginLeft: '20px' }}
                    onClick={openTemplateConfigModal('create')}>
                    保存为模板
                  </Button>
                ) : null}
                {templateDetail ? (
                  <Button
                    type="primary"
                    style={{ marginLeft: '20px' }}
                    onClick={openTemplateConfigModal('update')}>
                    更新模板
                  </Button>
                ) : null}
              </>
            )}
            {usedForPage ? (
              <Button
                type="primary"
                style={{ marginLeft: '20px' }}
                onClick={() => setOpenDeploy(true)}>
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
          onOk={EditTemplateAndCloseModal}
          ref={templateConfigRef}
          onCancel={closeTemplateConfigModal}
          type={templateConfigType}
        />
      </Flex>
      {/* 为了清除DeployConfig内部状态缓存 */}
      {openDeploy ? (
        <Modal
          open={openDeploy}
          onCancel={() => setOpenDeploy(false)}
          onOk={deploy}>
          <DeployConfig
            onChange={(data) => {
              deployDataRef.current = data;
            }}
          />
        </Modal>
      ) : null}
      <Modal
        open={openDeploySuccess}
        onCancel={closeDeploySuccessModal}
        onOk={closeDeploySuccessModal}
        mask={false}
        maskClosable={false}>
        <Flex direction="column" justifyContent="center" alignItems="center">
          <h3 style={{ marginBottom: '30px' }}>发布成功</h3>
          <p>
            页面地址：
            <a href={pagePathRef.current} type="_blank">
              {pagePathRef.current}
            </a>
          </p>
        </Flex>
      </Modal>
    </DragContext.Provider>
  );
};

export default ToCEditor;
