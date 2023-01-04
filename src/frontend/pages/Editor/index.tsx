import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { loadMicroApp, MicroApp } from 'qiankun';
import { Button, Input } from 'antd';
import { getParams } from '@duitang/dt-base';
import { pageModel as pageModelOfBackstage } from '@/backend/mock';
import { pageModel as pageModelOfFrontstage } from '@/backend/mock2';
import { getRandomString } from '@/backend/generateReactSourceCode/utils';
import { PageModel } from '@/backend/types';
import { HighLightCodeEditor } from '@/frontend/components';

const Editor = () => {
  const { type = 'tob' } = (getParams() || {}) as { type: 'toc' | 'tob' };
  const pageModelMap = {
    toc: pageModelOfFrontstage,
    tob: pageModelOfBackstage,
  };
  const pageModel = pageModelMap[type];
  const [key, setKey] = useState('test1');
  const [content, setContent] = useState(JSON.stringify(pageModel));
  const [sourceCode, setSourceCode] = useState('');
  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);

  useEffect(() => {
    pageModel.meta.key = key;
    setContent(JSON.stringify(pageModel));
  }, [key]);

  const previewPage = (pageModelContent: string) => {
    const suffix = getRandomString();
    const randomKey = `${key}${suffix}`;
    const pageModelObj: PageModel = JSON.parse(pageModelContent);
    pageModelObj.meta.key = randomKey;
    if (microAppRef.current) {
      microAppRef.current.unmount();
    }
    microAppRef.current = loadMicroApp({
      name: `luban-app-${randomKey}`,
      entry: `//localhost:8000/lubanApp/?content=${encodeURIComponent(
        JSON.stringify(pageModelObj),
      )}`,
      container: '#lubanAppContainer',
    });
  };

  const getReactCode = async () => {
    const code = await fetch(
      `//localhost:8000/compileToSourceCode/?content=${encodeURIComponent(
        content,
      )}`,
    )
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
        <div>
          <Button onClick={() => previewPage(content)}>预览页面</Button>
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
