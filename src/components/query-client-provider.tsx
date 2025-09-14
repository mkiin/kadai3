import {
  QueryClientProvider as PureQueryClientProvider,
  type QueryClient,
} from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <PureQueryClientProvider client={queryClient}>
      {children}
    </PureQueryClientProvider>
  );
}
