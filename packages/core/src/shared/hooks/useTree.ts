import { useContext, useMemo, useCallback } from 'react';
import { produce } from 'immer';
import { ModelTreeContext, StateTreeContext } from 'render/index';
import { readValueByPath, modifyValueByPath, isShow, isValidPath, getEventValue, createSingleton } from 'utils/index';

interface UseTreeParams {
  model?: MaybeHasSubPath;
  state?: MaybeHasSubPath;
  effect?: MaybeHasSubPath;
}

interface UseTreeResponse {
  nodeModel: any;
  nodeState: any;
  isShow: boolean;
  handleStateChange: (value: any, path?: MaybeHasSubPath) => void;
  handleModelChange: (value: any, path?: MaybeHasSubPath) => void;
}

type UserTree = (params: UseTreeParams) => UseTreeResponse;

export const useStateTreeRef = createSingleton();

export const useModelTreeRef = createSingleton();

/**
 *
 * @param { model, state, effect}
 * @param param.model 节点props中的model
 * @param param.state 节点props中的state
 * @param param.effect 节点props中的effect
 * @returns { nodeModel, nodeState, isShow, handleStateChange, handleModelChange }
 * @description returns各项含义：
 *              nodeModel：       节点关联的model值，
 *              nodeState：       节点关联的状态，
 *              isShow：          节点是否可见，
 *              handleStateChange：节点（比如表单）事件触发的回调，它会修改effect路径对应的state，
 *              handleModelChange：节点（比如表单）事件触发的回调，它会修改model路径对应的model。
 */
const useTree: UserTree = ({ model, state, effect }) => {
  const [modelTree, setModelTree] = useContext(ModelTreeContext);
  const [stateTree, setStateTree] = useContext(StateTreeContext);
  // 如果连续有多个操作，state不会及时修改，所以放在单例里，每次更新state同步给单例
  const modelTreeRef = useModelTreeRef(modelTree);
  const stateTreeRef = useStateTreeRef(stateTree);

  const nodeModel = useMemo(() => readValueByPath(modelTree, model), [modelTree, model]);
  const nodeState = useMemo(() => readValueByPath(stateTree, state), [stateTree, state]);

  const _isShow = useMemo(
    () => (nodeState ? nodeState.some((subNodeState) => isShow(state, subNodeState)) : true),
    [state, nodeState],
  );

  const handleStateChange = useCallback(
    (e, path?: MaybeHasSubPath) => {
      const value = getEventValue(e);
      let modifyStateSuccess;
      if (isValidPath(effect) || isValidPath(path)) {
        const newStateTree = produce(stateTreeRef.current, (draft: any) => {
          modifyStateSuccess = modifyValueByPath(draft, path || effect, value);
        });
        if (modifyStateSuccess) {
          setStateTree(newStateTree);
          stateTreeRef.current = newStateTree;
        }
      }
    },
    [effect, setStateTree, stateTreeRef],
  );

  const handleModelChange = useCallback(
    (e, path?: MaybeHasSubPath) => {
      const value = getEventValue(e);
      let modifyModelSuccess;
      if (isValidPath(model) || isValidPath(path)) {
        const newModelTree = produce(modelTreeRef.current, (draft: any) => {
          modifyModelSuccess = modifyValueByPath(draft, path || model, value);
        });
        if (modifyModelSuccess) {
          setModelTree(newModelTree);
          modelTreeRef.current = newModelTree;
        }
      }
    },
    [model, setModelTree, modelTreeRef],
  );

  return {
    // 该组件关联的model字段
    nodeModel,
    // 该组件关联的状态
    nodeState,
    // 该组件是否显示
    isShow: _isShow,
    // 组件发生change时，比如表单，触发的回调
    handleStateChange,
    handleModelChange,
  };
};

export default useTree;
