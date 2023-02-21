import { Meta, PageModel } from '@/backend/types';
import {
  add,
  copyNodeASTToParent,
  findPathById,
  remove,
  update,
} from '../pages/Editor/utils';
import { ToCComponentMeta } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCodePlugins/toCComponentsPluginsConfig';
import { NodeAST } from '../types';

export interface CurrentComponent extends ToCComponentMeta {
  id: number;
}

export interface EditorStore {
  currentChooseComponent: { component: CurrentComponent; config: any } | null;
  setCurrentChooseComponent: (
    data: { component: CurrentComponent; config: any } | null,
  ) => void;
  pageModel: PageModel;
  setPageMeta: (meta: Partial<Meta>) => void;
  addNodeAST: (nodeAST: NodeAST | NodeAST[], targetId?: number) => void;
  updateNodeAST: (id: number, props: any) => void;
  removeNodeAST: (id: number) => void;
  copyNodeASTToParent: (id: number) => void;
  clearAllNodeAST: () => void;
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
    view: null as any,
  },
  setCurrentChooseComponent(
    data: { component: CurrentComponent; config: any } | null,
  ) {
    set((state) => {
      state.editor.currentChooseComponent = data;
    });
  },
  setPageMeta(meta: Partial<Meta>) {
    set((state) => {
      if (meta) {
        state.editor.pageModel.meta = {
          ...state.editor.pageModel.meta,
          ...meta,
        };
      }
    });
  },
  addNodeAST(nodeAST: NodeAST | NodeAST[], targetId?: number) {
    set((state) => {
      if (targetId === undefined) {
        if (!state.editor.pageModel.view) {
          add(state.editor.pageModel, nodeAST);
        } else {
          add(state.editor.pageModel.view, nodeAST);
        }
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
      const { complete, nodes } = findPathById(state.editor.pageModel.view, id);
      if (complete) {
        const target = nodes[0];
        if (target) {
          update(state.editor.pageModel.view, id, props);
        }
      }
    });
  },
  removeNodeAST(id: number) {
    set((state) => {
      remove(state.editor.pageModel.view, id);
    });
  },
  copyNodeASTToParent(id: number) {
    set((state) => {
      copyNodeASTToParent(state.editor.pageModel.view, id);
    });
  },
  clearAllNodeAST() {
    set((state) => {
      state.editor.pageModel.view = null;
    });
  },
});

export default createEditorStore;
