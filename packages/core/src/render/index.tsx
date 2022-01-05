import { createContext, useMemo, useState, FunctionComponent } from 'react';
import parse from '../parse/index';
import Render from './Render';

export const ModelTreeContext = createContext<any>(undefined);
export const StateTreeContext = createContext<any>(undefined);

interface PageProps {
  data: any;
}

const Page: FunctionComponent<PageProps> = ({ data }) => {
  const { vdomTree = [], modelTree, stateTree } = useMemo(() => parse(data), [data]);
  const [model, setModel] = useState(modelTree);
  const [state, setState] = useState(stateTree);

  const modelValue = useMemo(() => [model, setModel], [model, setModel]);
  const stateValue = useMemo(() => [state, setState], [state, setState]);

  const render = useMemo(() => <Render data={vdomTree} />, [vdomTree]);
  return (
    <ModelTreeContext.Provider value={modelValue}>
      <StateTreeContext.Provider value={stateValue}>{render}</StateTreeContext.Provider>
    </ModelTreeContext.Provider>
  );
};

export default Page;
