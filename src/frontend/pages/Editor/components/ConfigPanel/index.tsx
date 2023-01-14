import { Drawer, Form } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { CurrentComponent } from '@/frontend/store/editor';
import { RenderConfig } from './components/RenderConfig';
import useStore from '@/frontend/store';

export const ConfigPanel: FC<{ data: CurrentComponent | null }> = ({
  data,
}) => {
  const [show, setShow] = useState(false);

  const onClose = useCallback(() => {
    useStore.getState().editor.setCurrentChooseComponent(null);
    setShow(false);
  }, []);

  useEffect(() => {
    if (!data) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [data]);

  return data ? (
    <Drawer
      title={data.name}
      width={500}
      open={show}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      mask={false}>
      <Form labelCol={{ span: 6 }} labelAlign="left">
        {data.configs.map((config, index) => (
          <RenderConfig key={config.name} data={data} index={index} />
        ))}
      </Form>
    </Drawer>
  ) : null;
};
