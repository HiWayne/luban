import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import createEditorStore, { EditorStore } from './editor';

interface Store {
  editor: EditorStore;
}

const useStore = create(
  immer<Store>((set) => ({
    editor: createEditorStore(set),
  })),
);

export default useStore;
