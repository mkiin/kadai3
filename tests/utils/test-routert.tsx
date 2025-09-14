import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function TestRouter ({ component } : {
  component : () => ReactNode
} ) {
    const history = createMemoryHistory({ initialEntries: ["/"] });
  
    const rootRoute = createRootRoute({});
  
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => component,
    });
  
    const routeTree = rootRoute.addChildren([indexRoute]);
    const router = createRouter({ routeTree, history });
  
    return <RouterProvider  router={router}/>
}