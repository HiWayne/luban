import { FunctionComponent, useState, createContext, useMemo, Dispatch, SetStateAction } from 'react';
import { produce } from 'immer';
import Container from './layouts/Container';
import HeadBar from './layouts/HeadBar';
import WorkSpace from './layouts/WorkSpace';
import Menus, { Menu } from './layouts/Menus';
import Canvas from './layouts/Canvas';
import Configure from './layouts/Configure';
import VdomTree from './layouts/VdomTree';
import * as baseComponents from 'core/src/render/baseComponents/index';
import * as customComponents from 'core/src/render/customComponents/index';
import { ComponentsObject } from 'core/src/types/types';
import testJson from 'core/src/test';

export const components: Menu[] = [];

Object.values(baseComponents as ComponentsObject).forEach((component: any) => {
  components.push({
    name: component._aliasName,
    key: component._name,
    props: component._config,
    levels: component._level,
    component,
  });
});

Object.values(customComponents as ComponentsObject).forEach((component: any) => {
  components.push({
    name: component._aliasName,
    key: component._name,
    props: component._config,
    levels: component._level,
    component,
  });
});

export const vdomTree = createContext<[VDomNode[], Dispatch<SetStateAction<VDomNode[]>>]>([] as any);
export const modelTree = createContext<[ModelTree, Dispatch<SetStateAction<ModelTree>>]>([] as any);
export const stateTree = createContext<[StateTree, Dispatch<SetStateAction<StateTree>>]>([] as any);

const Index: FunctionComponent = () => {
  const [selectedMenu, setSelectedMenu] = useState<Menu>(null as any);
  const [selectedOperate, setSelectedOperate] = useState<any>(null as any);
  const [vdom, setVdomTree] = useState<VDomNode[]>(JSON.parse(testJson).vdom);
  const [model, setModelTree] = useState<ModelTree>({});
  const [state, setStateTree] = useState<StateTree>({});

  const vdomTreeState = useMemo<[VDomNode[], Dispatch<SetStateAction<VDomNode[]>>]>(() => [vdom, setVdomTree], [vdom]);
  const modelTreeState = useMemo<[ModelTree, Dispatch<SetStateAction<ModelTree>>]>(
    () => [model, setModelTree],
    [model],
  );
  const stateTreeState = useMemo<[StateTree, Dispatch<SetStateAction<StateTree>>]>(
    () => [state, setStateTree],
    [state],
  );

  const [currentVdom, setCurrentVdom] = useState(null);

  const currentData = useMemo(
    () => ({
      vdom,
      model,
      state,
    }),
    [vdom, model, state],
  );

  const operate = useMemo(
    () => [
      { name: '视图树', key: 'vdom' },
      { name: '模型树', key: 'model' },
      { name: '状态树', key: 'state' },
    ],
    [],
  );

  return (
    <vdomTree.Provider value={vdomTreeState}>
      <modelTree.Provider value={modelTreeState}>
        <stateTree.Provider value={stateTreeState}>
          <Container>
            <HeadBar title="" data={currentData} />
            <WorkSpace>
              <Menus
                data={components}
                operateData={operate}
                selectedMenu={selectedMenu}
                selectedOperate={selectedOperate}
                onOperate={setSelectedOperate}
              ></Menus>
              <Canvas data={currentData}></Canvas>
              <Configure data={selectedMenu} currentVdom={currentVdom}></Configure>
              {selectedOperate && selectedOperate.key === 'vdom' ? (
                <VdomTree onSelect={setSelectedMenu} setCurrentVdom={setCurrentVdom} />
              ) : null}
            </WorkSpace>
          </Container>
        </stateTree.Provider>
      </modelTree.Provider>
    </vdomTree.Provider>
  );
};

export default Index;
