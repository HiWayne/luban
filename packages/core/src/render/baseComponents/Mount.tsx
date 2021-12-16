import { FunctionComponent, useEffect } from 'react';
import { Api, ComponentLevel, ComponentNames } from 'types/types';
import { definePropertyOfLevel, definePropertyOfName } from 'utils/index';
import { useApi } from 'hooks/index';

interface MountProps {
  api: Api;
}

const Mount: FunctionComponent<MountProps> = ({ api, children }) => {
  const fetchByApi = useApi({ api });
  useEffect(() => {
    fetchByApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>{children}</div>;
};

definePropertyOfName(Mount, ComponentNames.MOUNT);
definePropertyOfLevel(Mount, [ComponentLevel.ADVANCED]);

export default Mount;
