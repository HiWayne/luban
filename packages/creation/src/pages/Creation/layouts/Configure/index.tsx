import { FunctionComponent } from 'react';
import { Tabs } from 'antd';
import { ComponentLevel, ComponentNames } from 'core/src/types/types';
import * as ConfigRows from './components/index';
import { Menu } from '../Menus';
import Panel from '@creation/components/Panel';

const { TabPane } = Tabs;

type ComponentConfig = {
  [key in ComponentLevel]: object;
};

export interface UnitComponent {
  _name: ComponentNames;
  _aliasName: string;
  _level: ComponentLevel;
  _identifier: string;
  _config: ComponentConfig;
}

interface ConfigureProps {
  data: Menu;
}

const Configure: FunctionComponent<ConfigureProps> = ({ data }) => {
  return data ? (
    <Panel key={data.key} direction="right" width={370} style={{ width: '350px', height: 'calc(100vh - 80px)' }}>
      <h3>{`${data.name} 配置`}</h3>
      <Tabs defaultActiveKey="1">
        {[
          { key: 'basic', name: '基础' },
          { key: 'advanced', name: '进阶' },
        ].map(({ key: level, name }) => (
          <TabPane tab={name} key={level} style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {Object.entries((data.props && data.props[level]) || {}).map(([key, value]) => {
              const ConfigRow = (ConfigRows as any)[(value as any).type];
              if (ConfigRow) {
                return <ConfigRow key={(value as any).name} name={(value as any).name} tip={(value as any).tip} />;
              } else {
                return null;
              }
            })}
          </TabPane>
        ))}
      </Tabs>
    </Panel>
  ) : (
    <div style={{ width: '350px' }}></div>
  );
};

export default Configure;
