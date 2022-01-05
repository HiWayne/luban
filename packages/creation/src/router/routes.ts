import { ComponentType, lazy } from 'react';

const IndexPage = lazy(() => import('pages/Creation/index'));
const FilterGIFPage = lazy(() => import('pages/FilterGIF/index'));

interface Meta {
  title?: string;
  hidden?: boolean;
  role?: any;
}

export interface RouteItem {
  path: string;
  component: React.LazyExoticComponent<ComponentType<any>> | ComponentType;
  children?: RouteItem[];
  meta?: Meta;
}

const routes: RouteItem[] = [
  {
    path: '/',
    component: IndexPage,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/filtergif',
    component: FilterGIFPage,
    meta: {
      title: 'gif滤镜',
    },
  },
];

export default routes;
