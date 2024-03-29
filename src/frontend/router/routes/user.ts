import { lazy } from 'react';
import type { RouteType } from '../index';

const LazyLogin = lazy(() => import('pages/User/Login'));
const LazyRegister = lazy(() => import('pages/User/Register'));
const LazyProfile = lazy(() => import('pages/User/Profile'));

export const userRoutes: RouteType[] = [
  {
    path: '/login',
    element: LazyLogin,
  },
  {
    path: '/register',
    element: LazyRegister,
  },
  {
    path: '/profile',
    element: LazyProfile,
  },
];
