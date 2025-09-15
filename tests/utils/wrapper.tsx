// tests/utils/wrapper.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

const TestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = makeQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraUIProvider>{children}</ChakraUIProvider>
    </QueryClientProvider>
  );
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TestProvider>{children}</TestProvider>;
};

export default Wrapper;
