import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import createEditorStore, { EditorStore } from './editor';
import createUserStore, { UserStore } from './user';

interface Store {
  editor: EditorStore;
  user: UserStore;
}

const useStore = create(
  immer<Store>((set) => ({
    editor: createEditorStore(set),
    user: createUserStore(set),
  })),
);

export default useStore;
