import { lazy } from "react";
import type { RouteType } from "../index";

const lazyHome = lazy(() => import("pages/Home"));

export const homeRoutes: RouteType[] = [
  {
    path: "/",
    element: lazyHome,
  },
];
