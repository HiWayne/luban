import { lazy } from "react";
import type { RouteType } from "../index";

const LazyEditor = lazy(() => import("pages/Editor"));
const LazyProfile = lazy(() => import('pages/User/Profile'));

export const editorRoutes: RouteType[] = [
  {
    path: "/editor",
    element: LazyEditor,
    permissions: [],
  },
  {
    path: '/profile',
    element: LazyProfile,
  },
];
