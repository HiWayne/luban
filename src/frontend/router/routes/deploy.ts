import { lazy } from 'react';
import type { RouteType } from '../index';

const LazyDeployList = lazy(() => import('pages/Deploy/DeployList'));
const LazyDeployDetail = lazy(() => import('pages/Deploy/DeployDetail'));
const LazyCategory = lazy(() => import('pages/Deploy/CategoryManage'));

export const deployRoutes: RouteType[] = [
  {
    path: '/deploy/list',
    element: LazyDeployList,
    permissions: [],
  },
  {
    path: '/deploy/detail',
    element: LazyDeployDetail,
    permissions: [],
  },
  {
    path: '/deploy/categoryManage',
    element: LazyCategory,
    permissions: [],
  },
];
