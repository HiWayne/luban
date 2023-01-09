import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import createEditorStore, { EditorStore } from './editor';

interface Store {
  page: EditorStore;
}

const useStore = create(
  immer<Store>((set) => ({
    page: createEditorStore(set),
  })),
);

export default useStore;
