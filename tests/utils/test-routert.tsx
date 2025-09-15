// src/__test__/DummyRouter.tsx
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { type FC, type ReactNode, useEffect, useState } from "react";

export const TestRouter: FC<{ component: () => ReactNode }> = ({
  component,
}) => {
  const [router] = useState(() => {
    const rootRoute = createRootRoute({
      component: Outlet,
    });

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component,
    });

    const routeTree = rootRoute.addChildren([indexRoute]);
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return createRouter({ routeTree, history });
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    router.load().then(() => {
      setIsLoaded(true);
    });
  }, [router]);

  if (!isLoaded) {
    return null;
  }

  return <RouterProvider router={router} />;
};
