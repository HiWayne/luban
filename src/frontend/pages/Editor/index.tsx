import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { loadMicroApp, MicroApp } from 'qiankun';
import { Button, Input } from 'antd';
import { getParams } from '@duitang/dt-base';
import shallow from 'zustand/shallow';
import { pageModel as pageModelOfBackstage } from '@/backend/mock';
// import { pageModel as pageModelOfFrontstage } from '@/backend/mock2';
import { getRandomString } from '@/backend/generateReactSourceCode/utils';
import { PageModel } from '@/backend/types';
import { HighLightCodeEditor } from '@/frontend/components';
import { toCComponents } from './config';
import { ComponentsSelectArea, ComponentItem } from './components'
import useStore from '@/frontend/store';

const Editor = () => {
  const { type_ = 'tob' } = (getParams() || {}) as { type_: 'toc' | 'tob' };
  const pageModel = useStore((state) => state.editor.pageModel, shallow)
  const pageModelMap = {
    toc: pageModel,
    tob: pageModelOfBackstage,
  };
  const pageModel_ = pageModelMap[type_];
  const [key, setKey] = useState('test1');
  const [content, setContent] = useState(JSON.stringify(pageModel_));
  const [sourceCode, setSourceCode] = useState('');
  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);

  useEffect(() => {
    setContent(JSON.stringify(pageModel))
  }, [pageModel])

  useEffect(() => {
    pageModel.meta.key = key;
    setContent(JSON.stringify(pageModel));
  }, [key]);

  const previewPage = async (pageModelContent: string) => {
    const suffix = getRandomString();
    const randomKey = `${key}${suffix}`;
    const pageModelObj: PageModel = JSON.parse(pageModelContent);
    pageModelObj.meta.key = randomKey;
    const data: any = await fetch('//localhost:8000/lubanApp/', {
      method: 'post',
      body: JSON.stringify(pageModelObj),
    }).then((response) => response.json());
    if (data && data.data) {
      const htmlPath = data.data.htmlPath;
      if (htmlPath) {
        if (microAppRef.current) {
          microAppRef.current.unmount();
        }
        microAppRef.current = loadMicroApp({
          name: `luban-app-${randomKey}`,
          entry: `//localhost:8000${htmlPath}`,
          container: '#lubanAppContainer',
        });
      }
    }
  };

  const runPage = async (pageModelContent: string) => {
    const suffix = getRandomString();
    const randomKey = `${key}${suffix}`;
    const pageModelObj: PageModel = JSON.parse(pageModelContent);
    pageModelObj.meta.key = randomKey;
    pageModelObj.meta.mode = 'production';
    const data: any = await fetch('//localhost:8000/lubanApp/', {
      method: 'post',
      body: JSON.stringify(pageModelObj),
    }).then((response) => response.json());
    if (data && data.data) {
      const htmlPath = data.data.htmlPath;
      if (htmlPath) {
        if (microAppRef.current) {
          microAppRef.current.unmount();
        }
        microAppRef.current = loadMicroApp({
          name: `luban-app-${randomKey}`,
          entry: `//localhost:8000${htmlPath}`,
          container: '#lubanAppContainer',
        });
      }
    }
  };

  const getReactCode = async () => {
    const code = await fetch('//localhost:8000/compileToSourceCode/', {
      method: 'post',
      body: content,
    })
      .then((response) => response.json())
      .then((json) => json.data);
    setSourceCode(code);
  };

  return (
    <div style={{ display: 'flex', width: '100vw' }}>
      <div style={{ flex: '0 0 300px' }}>
        <Input value={key} onChange={(e) => setKey(e.target.value)} />
        <Input.TextArea
          style={{ width: '500px', height: '200px' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <h4>场景组件</h4>
        <ComponentsSelectArea>
          {/* toC */}
          {toCComponents.map(({ name, type, defaultAST }) => <ComponentItem name={name} type={type} defaultAST={defaultAST} key={name} />)}
        </ComponentsSelectArea>
        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => previewPage(content)}>
            预览页面（不能交互，防止和配置交互冲突）
          </Button>
          <Button
            style={{ marginLeft: '20px' }}
            onClick={() => runPage(content)}>
            运行页面（可以交互）
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button onClick={getReactCode}>预览代码</Button>
        </div>
        <div>
          <HighLightCodeEditor
            language="jsx"
            code={sourceCode}
            onChange={setSourceCode}
            style={{ width: '550px' }}
            wrapperStyle={{
              width: '550px',
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
        style={{ width: '375px', border: '1px solid #eee' }}
        key="container"
      />
    </div>
  );
};

export default Editor;
