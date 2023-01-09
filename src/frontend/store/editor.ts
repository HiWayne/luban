export interface EditorStore {}

const createEditorStore: (
  set: (
    nextStateOrUpdater: object | ((state: any) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => EditorStore = () => ({});

export default createEditorStore;
