// tests/utils/render-with-router.tsx
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type RouteComponent,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";

interface RenderOptions {
  pathPattern: string;
  initialEntry?: string;
}

export async function renderWithRouter(
  Component: RouteComponent,
  { pathPattern = "/test", initialEntry = pathPattern }: RenderOptions,
) {
  // ルートルートの作成
  const rootRoute = createRootRoute();

  // インデックスルートの作成
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>Index Page</div>,
  });

  // テスト対象のルート作成
  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: pathPattern,
    component: () => <Component />,
  });

  // ルーターの作成
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, testRoute]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    defaultPendingMinMs: 0,
  });

  // レンダリング
  const renderResult = render(<RouterProvider router={router} />);

  // ルート解決を待つ
  await screen.findByTestId("root-layout");

  return { router, renderResult };
}
