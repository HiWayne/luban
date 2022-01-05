import { useContext, useRef } from 'react';
import { produce } from 'immer';
import { StateTreeContext } from '../../render/index';
import { executeFunction, verifyExecuteResult } from '@core/utils/index';
import { useStateTreeRef } from '@core/hooks/useTree';

const useCustomLogic = (customLogic?: string, location?: string): ((...args: any[]) => any) | undefined => {
  const [stateTree, setStateTree] = useContext(StateTreeContext);
  // 如果连续有多个操作，state不会及时修改，所以放在单例里，每次更新state同步给单例
  const stateTreeRef = useStateTreeRef(stateTree);
  const nextHasCalled = useRef(false);

  if (typeof customLogic === 'string' && customLogic) {
    return async () => {
      try {
        const _immer = (modify: any) => {
          return produce(stateTreeRef.current, (draft: any) => {
            if (typeof modify === 'function') {
              modify(draft);
            }
          });
        };
        const next = (newStateTree: StateTree) => {
          nextHasCalled.current = true;
          setStateTree(newStateTree);
          stateTreeRef.current = newStateTree;
        };
        // 自定义click在最终要修改状态时，将修改函数（就是本该传给immer的produce的函数）传给_immer函数，得到新结果后传给next函数
        const executeResult = executeFunction(customLogic, _immer, next);
        // maybePromiseStateTree可能是promise
        if (!verifyExecuteResult(executeResult)) {
          console.error(`custom-click occurred error`, location ? ` in ${location}` : '');
        } else {
          if (executeResult !== undefined && !nextHasCalled.current) {
            const newState = await executeResult;
            next(newState);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        nextHasCalled.current = false;
      }
    };
  } else {
    return;
  }
};

export default useCustomLogic;
