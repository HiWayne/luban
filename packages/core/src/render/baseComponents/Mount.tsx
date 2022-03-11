import { FunctionComponent, useEffect } from 'react';
import { Api, ComponentLevel, ComponentNames } from '@core/types/types';
import { definePropertyOfLevel, definePropertyOfName, definePropertyOfAliasName } from '@core/utils/index';
import { useApi, useRenderEditableWrapper, useCustomLogic } from '@core/hooks/index';
import { styleWithoutShapeInEditMode } from '@core/styles/index';

interface MountProps extends CommonProps {
  api: Api;
  didUnMount: string;
}

const Mount: FunctionComponent<MountProps> = (props) => {
  const { api, children, renderEditableWrapper, _editable, customLogic, didUnMount } = props;

  const { extraStyleOfRoot, renderedEditable } = useRenderEditableWrapper(renderEditableWrapper, props);

  const fetchByApi = useApi({ api });

  const customFunction = useCustomLogic(customLogic);

  const didUnMountFunction = useCustomLogic(didUnMount);

  useEffect(() => {
    if (api) {
      fetchByApi();
    }
    if (typeof customFunction === 'function') {
      customFunction();
    }
    return () => {
      if (typeof didUnMountFunction === 'function') {
        didUnMountFunction();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return _editable ? (
    <div style={{ ...styleWithoutShapeInEditMode, ...extraStyleOfRoot }}>
      mounted hook
      {renderedEditable}
    </div>
  ) : (
    <div>{children}</div>
  );
};

definePropertyOfName(Mount, ComponentNames.MOUNT);
definePropertyOfAliasName(Mount, 'mounted-hook');
definePropertyOfLevel(Mount, [ComponentLevel.ADVANCED]);

export default Mount;
