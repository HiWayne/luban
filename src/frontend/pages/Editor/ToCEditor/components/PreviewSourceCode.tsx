import { FC, useCallback, useState } from 'react';
import { Button, Modal } from 'antd';
import { Flex, HighLightCodeEditor } from '@/frontend/components';
import { ReactComponent as CodeIconSVG } from '../../assets/code.svg';

interface PreviewSourceCodeProps {
  sourceCode: string;
  setSourceCode: (code: string) => void;
  getReactCode: () => void;
}

export const PreviewSourceCode: FC<PreviewSourceCodeProps> = ({
  sourceCode,
  setSourceCode,
  getReactCode,
}) => {
  const [show, setShow] = useState(false);

  const openModal = useCallback(() => {
    setShow(true);
    getReactCode();
  }, [getReactCode]);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <>
      <Button style={{ marginRight: '8px' }} type="primary" onClick={openModal}>
        <Flex justifyContent="center" alignItems="center">
          <CodeIconSVG />
          <span style={{ marginLeft: '8px' }}>预览源码</span>
        </Flex>
      </Button>
      <Modal width={800} open={show} onCancel={closeModal} closable={false}>
        <HighLightCodeEditor
          language="jsx"
          code={sourceCode}
          onChange={setSourceCode}
          style={{ width: '760px' }}
          wrapperStyle={{
            width: '760px',
            height: '500px',
          }}
        />
      </Modal>
    </>
  );
};
