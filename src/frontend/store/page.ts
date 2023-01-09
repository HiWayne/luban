export interface PageStore {}

const createPageStore: (
  set: (
    nextStateOrUpdater: object | ((state: any) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => PageStore = () => ({});

export default createPageStore;
