import { NodeAST } from '@/backend/types/frontstage/index';
import { PageModel } from '@/backend/types';

export interface EditorStore {
  currentChooseComponent: NodeAST;
  pageModel: PageModel,
  addAst: (ast: NodeAST) => void;
}

const createEditorStore: (
  set: (
    nextStateOrUpdater: object | ((state: any) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => EditorStore = (set) => ({
  currentChooseComponent: {
    id: 0,
    type: 'BlockContainer',
    props: {},
  },
  pageModel: {
    meta: {
      title: '换美图 过圣诞',
      key: 'test1',
      path: '/test1',
      env: ['mobile', 'react', 'mpa'],
      mode: 'development',
    },
    view: {
      id: 1,
      type: 'BlockContainer',
      props: {
        style: {
          position: 'relative',
        },
      },
      children: [],
    },
  },
  addAst(ast) {
    set((state) => {
      const newAst = [...state.editor.pageModel.view.children, ast];
      state.editor.pageModel.view.children = newAst;
    });
  },
});

export default createEditorStore;
