import { lazy } from 'react';
import type { RouteType } from '../index';

const LazyEditor = lazy(() => import('pages/Editor'));

export const editorRoutes: RouteType[] = [
  {
    path: '/editor',
    element: LazyEditor,
    permissions: [],
  },
];
