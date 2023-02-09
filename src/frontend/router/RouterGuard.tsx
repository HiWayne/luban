import { FC, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AccessDenied, Loading } from 'components/index';

interface Auth {
  loading: boolean;
  auth: boolean;
  login: boolean;
}

interface RouterGuardProps {
  from: string;
  element: FC;
  permissions?: string[];
  getAuth?: (permissions?: string[]) => Promise<Auth>;
  __test__?: { error: boolean; data: any };
}

const RouterGuard: FC<RouterGuardProps> = ({
  from,
  element: Element,
  permissions,
  getAuth,
}) => {
  const [{ loading, auth, login }, setStatus] = useState(
    typeof getAuth === 'function'
      ? {
          loading: false,
          auth: false,
          login: false,
        }
      : {
          loading: false,
          auth: true,
          login: true,
        },
  );

  const params = useParams() || {};

  useEffect(() => {
    (async () => {
      if (typeof getAuth === 'function') {
        setStatus((status) => ({
          ...status,
          loading: true,
        }));
        const response = await getAuth(permissions);
        setStatus(response);
      }
    })();
  }, []);

  if (loading) {
    return <Loading size="large" />;
  }
  if (auth) {
    return <Element />;
  } else if (!login) {
    return <Navigate to="/login" state={{ ...params, __from: from }} replace />;
  } else {
    return <AccessDenied />;
  }
};

export default RouterGuard;
