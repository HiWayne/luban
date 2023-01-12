import { NodeAST } from '@/backend/types/frontstage/index';
import { PageModel } from '@/backend/types';
import { createUniqueId } from '../pages/Editor/utils';
import { ToCComponent } from '../pages/Editor/config';
import {
  add,
  findPathById,
  remove,
  update,
} from '../pages/Editor/utils/operateNodeAST';

export interface CurrentComponent extends ToCComponent {
  id: number;
}

export interface EditorStore {
  currentChooseComponent: CurrentComponent | null;
  setCurrentChooseComponent: (component: CurrentComponent | null) => void;
  pageModel: PageModel;
  addNodeAST: (ast: NodeAST, targetId?: number) => void;
  updateNodeAST: (id: number, props: any) => void;
  removeNodeAST: (id: number) => void;
}

const createEditorStore: (
  set: (
    nextStateOrUpdater: object | ((state: any) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => EditorStore = (set) => ({
  currentChooseComponent: null,
  pageModel: {
    meta: {
      title: '换美图 过圣诞',
      key: 'test1',
      path: '/test1',
      env: ['mobile', 'react', 'mpa'],
      mode: 'development',
    },
    view: {
      id: createUniqueId(),
      type: 'BlockContainer',
      props: {},
      children: [],
    },
  },
  setCurrentChooseComponent(component: CurrentComponent | null) {
    set((state) => {
      state.editor.currentChooseComponent = component;
    });
  },
  addNodeAST(nodeAST: NodeAST, targetId?: number) {
    set((state) => {
      if (targetId === undefined) {
        state.editor.pageModel.view.children.push(nodeAST);
      } else {
        const { complete, nodes, parentProperty } = findPathById(
          state.editor.pageModel.view,
          targetId,
        );
        if (complete) {
          const target = nodes[0];
          add(target, nodeAST, parentProperty);
        }
      }
    });
  },
  updateNodeAST(id: number, props: any) {
    set((state) => {
      update(state.editor.pageModel.view, id, props);
    });
  },
  removeNodeAST(id: number) {
    set((state) => {
      remove(state.editor.pageModel.view, id);
    });
  },
});

export default createEditorStore;
