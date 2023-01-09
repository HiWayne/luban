import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import createPageStore, { PageStore } from './page';

interface Store {
  page: PageStore;
}

const useStore = create(
  immer<Store>((set) => ({
    page: createPageStore(set),
  })),
);

export default useStore;
