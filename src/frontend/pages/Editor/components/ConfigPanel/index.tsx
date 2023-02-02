import { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Form, Modal } from 'antd';
import { isExist } from '@duitang/dt-base';
import { CurrentComponent } from '@/frontend/store/editor';
import { RenderConfig } from './components/RenderConfig';
import useStore from '@/frontend/store';
import { useModifyPage } from '../../hooks';

export const ConfigPanel: FC<{
  data: { component: CurrentComponent; config: any } | null;
}> = ({ data }) => {
  const [show, setShow] = useState(false);

  const { removeComponent } = useModifyPage();

  const onClose = useCallback(() => {
    useStore.getState().editor.setCurrentChooseComponent(null);
    setShow(false);
  }, []);

  const onDelete = useCallback(() => {
    Modal.confirm({
      title: '删除',
      content: `确定删除【${data?.component.name}】组件吗`,
      onOk: () => {
        if (isExist(data?.component.id)) {
          removeComponent(data?.component.id as number);
          onClose();
        }
      },
    });
  }, [data?.component.id]);

  useEffect(() => {
    if (!data) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [data]);

  return data ? (
    <Drawer
      title={data.component.name}
      width={500}
      open={show}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      mask={false}>
      <Form labelCol={{ span: 7 }} labelAlign="left">
        {data.component.configs.map((config, index) => (
          <RenderConfig
            key={config.name}
            data={data.component}
            initialConfig={data.config}
            index={index}
          />
        ))}
      </Form>
      <Button danger onClick={onDelete}>
        删除
      </Button>
    </Drawer>
  ) : null;
};
