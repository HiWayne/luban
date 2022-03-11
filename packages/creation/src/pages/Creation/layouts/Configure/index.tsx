import { FunctionComponent, useContext, useMemo } from 'react';
import { Tabs } from 'antd';
import { ComponentLevel, ComponentNames } from 'core/src/types/types';
import * as ConfigRows from './components/index';
import { Menu } from '../Menus';
import { Panel } from '@creation/components/index';
import { vdomTree } from '../../index';
import produce from 'immer';

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

const hasChildren = (vdom: VDomNode): VDomNode[] | undefined => {
  if (Array.isArray(vdom.children) && vdom.children.length) {
    return vdom.children;
  }
  if (Array.isArray(vdom.content) && vdom.content.length) {
    return vdom.content;
  }
  if (Array.isArray(vdom.footer) && vdom.footer.length) {
    return vdom.footer;
  }
  if (
    Array.isArray(vdom.columns) &&
    vdom.columns.length &&
    vdom.columns.find((column) => Array.isArray(column.render) && column.render.length)
  ) {
    return vdom.columns.find((column) => Array.isArray(column.render) && column.render.length);
  }
};

export const findVdomById = (
  vdoms: VDomNode[] | undefined,
  id: number | string,
  callback?: (root: any[], index: number) => any,
  logMessage?: string,
): VDomNode | null => {
  if (!vdoms || (typeof id !== 'number' && typeof id !== 'string')) {
    return null;
  }
  const length = vdoms.length;
  for (let i = 0; i < length; i++) {
    if (logMessage) {
      console.log(logMessage, vdoms[i].id, id, i);
    }
    if (vdoms[i].id === id) {
      const result = vdoms[i];
      if (typeof callback === 'function') {
        callback(vdoms, i);
      }
      return result;
    } else if (hasChildren(vdoms[i])) {
      if (logMessage) {
        console.log(logMessage, 'hasChildren', vdoms[i].id, id, i);
      }
      const result = findVdomById(hasChildren(vdoms[i]), id, callback, logMessage);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const loop = (vdoms: VDomNode[] | undefined, callback?: (root: any[], index: number) => any) => {
  if (Array.isArray(vdoms)) {
    const length = vdoms.length;
    for (let i = 0; i < length; i++) {
      if (typeof callback === 'function') {
        callback(vdoms, i);
      }
      if (hasChildren(vdoms[i])) {
        loop(hasChildren(vdoms[i]), callback);
      }
    }
  }
};

interface ConfigureProps {
  data: Menu;
  currentVdom: VDomNode | null;
}

const Configure: FunctionComponent<ConfigureProps> = ({ data, currentVdom }) => {
  const [vdom, setVdom] = useContext(vdomTree);
  const vdomData = useMemo(() => findVdomById(vdom, (currentVdom && currentVdom.id) || ''), [vdom, currentVdom]);

  return data && currentVdom ? (
    <Panel key={data.key} direction="right" width={370} style={{ width: '350px', height: 'calc(100vh - 80px)' }}>
      <>
        <h3>{`${data.name} 配置`}</h3>
        <Tabs defaultActiveKey={currentVdom.level}>
          {[
            { key: ComponentLevel.BASIC, name: '基础' },
            { key: ComponentLevel.ADVANCED, name: '进阶' },
          ].map(({ key: level, name }) => (
            <TabPane tab={name} key={level} style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {Object.entries((data.props && data.props[level]) || {}).map(([key, value]) => {
                const ConfigRow = (ConfigRows as any)[(value as any).type];
                if (ConfigRow) {
                  return (
                    <ConfigRow
                      key={(value as any).name}
                      name={(value as any).name}
                      tip={(value as any).tip}
                      value={vdomData && vdomData[key as keyof VDomNode]}
                      onChange={(e: Event) => {
                        const newVdom = produce(vdom, (draft) => {
                          const data = findVdomById(draft, currentVdom.id);
                          // @ts-ignore
                          (data as VDomNode)[key as keyof VDomNode] = e.target.value;
                        });
                        setVdom(newVdom);
                      }}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </TabPane>
          ))}
        </Tabs>
      </>
    </Panel>
  ) : (
    <div style={{ width: '350px' }}></div>
  );
};

export default Configure;
