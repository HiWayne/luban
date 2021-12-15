import { useContext } from 'react';
import { produce } from 'immer';
import { StateTreeContext } from 'render/index';
import { executeFunction, createSingleton, verifyExecuteResult } from 'utils/index';
import { useStateTreeRef } from 'hooks/useTree';

const useClick = (onClick?: string, location?: string): ((...args: any[]) => any) | undefined => {
  const [stateTree, setStateTree] = useContext(StateTreeContext);
  // 如果连续有多个操作，state不会及时修改，所以放在单例里，每次更新state同步给单例
  const stateTreeRef = useStateTreeRef(stateTree);

  if (typeof onClick === 'string' && onClick) {
    return async () => {
      try {
        let result;
        const maybePromiseStateTree = produce(stateTreeRef.current, (state: any) => {
          // 可能是promise
          result = executeFunction(onClick, state);
          if (result instanceof Promise) {
            return result;
          }
        });
        if (verifyExecuteResult(result)) {
          const newStateTree = await maybePromiseStateTree;
          setStateTree(newStateTree);
        } else {
          console.error(`onClick occurred error`, location ? ` in ${location}` : '');
        }
      } catch (e) {
        console.error(e);
      }
    };
  } else {
    return;
  }
};

export default useClick;
