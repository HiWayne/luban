import { lazy } from "react";
import type { RouteType } from "../index";

const LazyLogin = lazy(() => import("pages/Login"));

export const loginRoutes: RouteType[] = [
  {
    path: "/login",
    element: LazyLogin,
  },
];
