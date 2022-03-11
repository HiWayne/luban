import { createContext, useMemo, useState, FunctionComponent } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import parse, { ParsedDataOfInput } from '../parse/index';
import Render, { Components } from './Render';
import { ComponentLevel, ComponentNames } from '@core/types/types';
import { ComponentConfig } from '@core/utils/others';
import {
  definePropertyOfName,
  definePropertyOfAliasName,
  definePropertyOfLevel,
  definePropertyOfConfig,
} from '@core/utils/index';

interface AddCustomComponentConfig {
  name: ComponentNames;
  aliasName: string;
  levels: ComponentLevel[];
  config: ComponentConfig;
}

export const addCustomComponent = (component: FunctionComponent, componentConfig: AddCustomComponentConfig) => {
  const { name, aliasName, levels, config } = componentConfig;
  definePropertyOfName(component, name);
  definePropertyOfAliasName(component, aliasName);
  definePropertyOfLevel(component, levels);
  definePropertyOfConfig(component, config);
  // @ts-ignore
  Components[name] = component;
};

export const VdomTreeContext = createContext<any>(undefined);
export const ModelTreeContext = createContext<any>(undefined);
export const StateTreeContext = createContext<any>(undefined);

interface PageProps {
  data: string | ParsedDataOfInput;
  editable?: boolean;
}

const Page: FunctionComponent<PageProps> = ({ data, editable }) => {
  const { vdomTree = [], modelTree, stateTree } = useMemo(() => parse(data), [data]);
  const [vdom, setVdom] = useState(vdomTree);
  const [model, setModel] = useState(modelTree);
  const [state, setState] = useState(stateTree);
  // @ts-ignore
  window.vdom = vdom;

  const vdomValue = useMemo(() => [vdom, setVdom], [vdom, setVdom]);
  const modelValue = useMemo(() => [model, setModel], [model, setModel]);
  const stateValue = useMemo(() => [state, setState], [state, setState]);

  const render = useMemo(() => <Render data={vdom} editable={editable} />, [vdom, editable]);
  return (
    <DndProvider backend={HTML5Backend}>
      <VdomTreeContext.Provider value={vdomValue}>
        <ModelTreeContext.Provider value={modelValue}>
          <StateTreeContext.Provider value={stateValue}>{render}</StateTreeContext.Provider>
        </ModelTreeContext.Provider>
      </VdomTreeContext.Provider>
    </DndProvider>
  );
};

export default Page;
