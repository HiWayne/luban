import { Drawer, Form } from 'antd';
import { FC } from 'react';
import { ToCComponent } from '../../config';
import { RenderConfig } from './components/RenderConfig';

export const ConfigPanel: FC<{ id: number; data: ToCComponent }> = ({
  id,
  data,
}) => {
  const { name, configs } = data;
  return (
    <Drawer
      title={name}
      width={500}
      open
      bodyStyle={{ paddingBottom: 80 }}
      mask={false}>
      <Form labelCol={{ span: 6 }} labelAlign="left">
        {configs.map((config) => (
          <RenderConfig key={config.name} id={id} config={config} />
        ))}
      </Form>
    </Drawer>
  );
};
