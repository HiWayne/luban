import { FunctionComponent, useContext, useEffect } from 'react';
import { Api, ComponentLevel, ComponentNames } from 'types/types';
import { definePropertyOfLevel, definePropertyOfName, fetchByApiConfig } from 'utils/index';
import { ModelTreeContext } from 'render/index';
import useTree from 'hooks/useTree';

interface MountProps {
  api: Api;
}

const Mount: FunctionComponent<MountProps> = ({ api, children }) => {
  const [modelTree] = useContext(ModelTreeContext);
  const { handleStateChange } = useTree({ model: api.model, effect: api.effect });
  useEffect(() => {
    fetchByApiConfig(api, undefined, handleStateChange, undefined, modelTree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>{children}</div>;
};

definePropertyOfName(Mount, ComponentNames.MOUNT);
definePropertyOfLevel(Mount, [ComponentLevel.ADVANCED]);

export default Mount;
