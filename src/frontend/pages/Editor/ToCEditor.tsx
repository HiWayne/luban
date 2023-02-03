import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { loadMicroApp, MicroApp } from 'qiankun';
import styled from 'styled-components';
import { Button, Input, notification } from 'antd';
import shallow from 'zustand/shallow';
import { getRandomString } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { PageModel } from '@/backend/types';
import { HighLightCodeEditor } from '@/frontend/components';
import * as compileFunctions from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/plugins';
import type { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import {
  ConfigPanel,
  ComponentsSelectArea,
  ComponentItem,
  TemplateConfig,
  TemplateList,
} from './components';
import useStore from '@/frontend/store';
import { useCreateTemplateApi } from './api';
import { SaveTemplateRequestDTO } from '@/backend/service/templateService/types';
import { useEditorInteractive } from './hooks';
import { request } from '@/frontend/utils';

export const toCComponents = Object.values(compileFunctions)
  .map((compileFunction) => (compileFunction as any).plugin as ToCComponent)
  .sort((a, b) => a.sort - b.sort);

const Title = styled.h3`
  margin: 20px 0 12px 0;
`;

const LightText = styled.p`
  margin: 12px 0;
  font-size: 10px;
  color: #aaa;
`;

const ToCEditor = () => {
  const { pageModel, currentComponent } = useStore(
    (state) => ({
      pageModel: state.editor.pageModel,
      currentComponent: state.editor.currentChooseComponent,
    }),
    shallow,
  );

  const [key, setKey] = useState('test1');
  const [content, setContent] = useState(JSON.stringify(pageModel));
  const [sourceCode, setSourceCode] = useState('');
  const [templateConfigShow, setTemplateConfigShow] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);
  const controllerRef: MutableRefObject<AbortController | null> = useRef(null);

  const { createTemplate } = useCreateTemplateApi();

  const { onDragStart, onDragEnd, onDragOver, onDrop } =
    useEditorInteractive(updateCount);

  useEffect(() => {
    setContent(JSON.stringify(pageModel));
  }, [pageModel]);

  useEffect(() => {
    setContent(
      JSON.stringify({ ...pageModel, meta: { ...pageModel.meta, key } }),
    );
  }, [key]);

  const previewPage = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    const { signal } = controller;

    controllerRef.current = controller;

    const suffix = getRandomString();
    const randomKey = `${key}${suffix}`;
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
          container: '#lubanAppContainer',
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

  const runPage = useCallback(async () => {
    const suffix = getRandomString();
    const randomKey = `${key}${suffix}`;
    const tempPageModel: PageModel = {
      ...pageModel,
      meta: { ...pageModel.meta },
    };
    tempPageModel.meta.key = randomKey;
    tempPageModel.meta.mode = 'production';
    const data: any = await request('/api/generatePage/', {
      method: 'post',
      body: JSON.stringify(tempPageModel),
    });
    if (data && data.data) {
      const htmlPath = data.data.htmlPath;
      if (htmlPath) {
        if (microAppRef.current) {
          microAppRef.current.unmount();
        }
        microAppRef.current = loadMicroApp({
          name: `luban-app-${randomKey}`,
          entry: `${htmlPath}`,
          container: '#lubanAppContainer',
        });
      }
    }
  }, [pageModel]);

  const deploy = useCallback(async () => {
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

  const getReactCode = async () => {
    const code = await fetch('/api/compileToSourceCode/', {
      method: 'post',
      body: content,
    })
      .then((response) => response.json())
      .then((json) => json.data);
    setSourceCode(code);
  };

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

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        gap: '20px',
      }}>
      <div style={{ flex: '0 0 400px' }}>
        {/* <Input value={key} onChange={(e) => setKey(e.target.value)} />
        <Input.TextArea
          style={{ width: '400px', height: '200px' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        /> */}
        <Title>场景组件</Title>
        <LightText>可拖动到指定位置，若点击将在页面末尾添加</LightText>
        <ComponentsSelectArea>
          {/* toC */}
          {toCComponents.map((component) => (
            <ComponentItem
              data={component}
              key={component.name}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            />
          ))}
        </ComponentsSelectArea>
        <div style={{ marginTop: '20px' }}>
          <Button
            style={{ marginLeft: '20px' }}
            onClick={openTemplateConfigModal}>
            保存为模板
          </Button>
          <Button style={{ marginLeft: '20px' }} onClick={runPage}>
            运行真实页面
          </Button>
          <Button style={{ marginLeft: '20px' }} onClick={deploy}>
            发布
          </Button>
        </div>
        <Title>模板市场</Title>
        <TemplateList />
        <div style={{ marginTop: '20px' }}>
          <Button onClick={getReactCode}>预览代码</Button>
        </div>
        <div>
          <HighLightCodeEditor
            language="jsx"
            code={sourceCode}
            onChange={setSourceCode}
            style={{ width: '400px' }}
            wrapperStyle={{
              width: '400px',
              height: '300px',
            }}
          />
          {/* <Input.TextArea
          style={{ width: '300px', height: '300px' }}
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
        /> */}
        </div>
      </div>
      <div
        id="lubanAppContainer"
        style={{
          marginTop: '5vh',
          position: 'relative',
          width: '375px',
          height: '90vh',
          border: '1px solid #ddd',
          boxSizing: 'border-box',
        }}
        key="container"
      />
      <div>
        <ConfigPanel data={currentComponent} onDrop={onDrop} />
      </div>
      <TemplateConfig
        open={templateConfigShow}
        onOk={createTemplateAndCloseModal}
        onCancel={closeTemplateConfigModal}
        type="create"
      />
    </div>
  );
};

export default ToCEditor;
