import { FunctionComponent } from 'react';

interface useRenderEditableWrapperReturn {
  extraStyleOfRoot: any;
  RenderEditable: FunctionComponent;
}

/**
 * @description 返回可编辑组件外壳，组件额外style的hooks
 * @param {FunctionComponent} renderEditableWrapper 可编辑组件外壳
 * @returns {useRenderEditableWrapperReturn}
 */
const useRenderEditableWrapper = (renderEditableWrapper: FunctionComponent): useRenderEditableWrapperReturn => {
  if (renderEditableWrapper) {
    return { extraStyleOfRoot: { position: 'relative' }, RenderEditable: renderEditableWrapper };
  } else {
    return { extraStyleOfRoot: {}, RenderEditable: () => null };
  }
};

export default useRenderEditableWrapper;
