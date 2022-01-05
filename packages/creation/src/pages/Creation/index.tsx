import { FunctionComponent, useState, createContext, useMemo } from 'react';
import { produce } from 'immer';
import Container from './layouts/Container';
import HeadBar from './layouts/HeadBar';
import WorkSpace from './layouts/WorkSpace';
import Menus, { Menu } from './layouts/Menus';
import Canvas from './layouts/Canvas';
import Configure from './layouts/Configure';
import * as baseComponents from 'core/src/render/baseComponents/index';
import * as customComponents from 'core/src/render/customComponents/index';
import { ComponentsObject } from 'core/src/types/types';

const components: Menu[] = [];

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

const VdomTree = createContext([]);
const ModelTree = createContext({});
const StateTree = createContext({});

const Index: FunctionComponent = () => {
  const [selectedMenu, setSelectedMenu] = useState<Menu>(null as any);
  const [vdomTree, setVdomTree] = useState([]);
  const [modelTree, setModelTree] = useState({});
  const [stateTree, setStateTree] = useState({});

  const currentData = useMemo(
    () => ({
      vdom: vdomTree,
      model: modelTree,
      state: stateTree,
    }),
    [vdomTree, modelTree, stateTree],
  );

  return (
    <VdomTree.Provider value={vdomTree}>
      <ModelTree.Provider value={modelTree}>
        <StateTree.Provider value={stateTree}>
          <Container>
            <HeadBar title="" data={currentData} />
            <WorkSpace>
              <Menus data={components} onSelect={setSelectedMenu} selectedMenu={selectedMenu}></Menus>
              <Canvas></Canvas>
              <Configure data={selectedMenu}></Configure>
            </WorkSpace>
          </Container>
        </StateTree.Provider>
      </ModelTree.Provider>
    </VdomTree.Provider>
  );
};

export default Index;
