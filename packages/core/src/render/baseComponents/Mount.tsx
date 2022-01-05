import { FunctionComponent, useEffect } from 'react';
import { Api, ComponentLevel, ComponentNames } from '@core/types/types';
import { definePropertyOfLevel, definePropertyOfName, definePropertyOfAliasName } from '@core/utils/index';
import { useApi } from '@core/hooks/index';

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
definePropertyOfAliasName(Mount, 'mounted-request-hooks');
definePropertyOfLevel(Mount, [ComponentLevel.ADVANCED]);

export default Mount;
