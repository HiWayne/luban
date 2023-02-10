import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { loadMicroApp, MicroApp } from 'qiankun';
import { OutputPageArea } from './OutputPageArea';
import useStore from '@/frontend/store';
import { PageModel } from '@/backend/types';
import { request } from '@/frontend/utils';
import { KEY } from '..';
import { Flex, Loading } from '@/frontend/components';

export const SimulateReal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const microAppRef: MutableRefObject<MicroApp | null> = useRef(null);

  const pageModel = useStore((state) => state.editor.pageModel);

  const runPage = useCallback(async () => {
    if (!pageModel.view) {
      return;
    }
    setLoading(true);
    const tempPageModel: PageModel = {
      ...pageModel,
      meta: { ...pageModel.meta },
    };
    tempPageModel.meta.mode = 'production';
    const data: any = await request('/api/generatePage/', {
      method: 'post',
      body: JSON.stringify(tempPageModel),
    }).catch(() => {
      return null;
    });
    if (data && data.data) {
      const htmlPath = data.data.htmlPath;
      if (htmlPath) {
        if (microAppRef.current) {
          microAppRef.current.unmount();
        }
        microAppRef.current = loadMicroApp({
          name: `luban-app-${KEY}`,
          entry: `${htmlPath}`,
          container: '#lubanAppContainer-production',
        });
        microAppRef.current.mount().finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [pageModel]);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const simulateReal = useCallback(() => {
    if (!pageModel.view) {
      message.error('页面内容不能为空');
      return;
    }
    openModal();
    runPage();
  }, [pageModel, runPage]);

  return (
    <>
      <Button icon={<PlayCircleOutlined />} onClick={simulateReal}>
        模拟真实环境
      </Button>
      <Modal
        width={600}
        open={open}
        onCancel={closeModal}
        closable={false}
        footer={null}
        style={{
          top: 'calc(5vh - 20px)',
          paddingBottom: 0,
          zIndex: 999,
        }}>
        {!loading ? (
          <Flex justifyContent="center" alignItems="center">
            <OutputPageArea mode="production" />
          </Flex>
        ) : (
          <Loading size="large" />
        )}
      </Modal>
    </>
  );
};
