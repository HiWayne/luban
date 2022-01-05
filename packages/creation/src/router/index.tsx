import { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes, { RouteItem } from './routes';
import Loading from '@creation/components/Loading';

const renderRoutes = (routes: RouteItem[]) => {
  if (Array.isArray(routes)) {
    return (
      <Switch>
        {routes.map((route) => {
          if (Array.isArray(route.children) && route.children.length >= 0) {
            return (
              <Route
                exact={route.path === '/'}
                key={route.path + route?.meta?.title || ''}
                path={route.path}
                component={route.component}
                children={renderRoutes(route.children)}
              />
            );
          } else {
            return (
              <Route
                exact={route.path === '/'}
                key={route.path + route?.meta?.title || ''}
                path={route.path}
                component={route.component}
              />
            );
          }
        })}
      </Switch>
    );
  } else {
    return undefined;
  }
};
const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>{renderRoutes(routes)}</Suspense>
  </BrowserRouter>
);

export default Router;
