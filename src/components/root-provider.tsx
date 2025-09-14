import type React from "react";
import { QueryClientProvider } from "@/components/query-client-provider";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";

type RootProviderProps = {
  children: React.ReactNode;
};

export function RootProvider(props: RootProviderProps) {
  return (
    <QueryClientProvider>
      <ChakraUIProvider>{props.children}</ChakraUIProvider>
    </QueryClientProvider>
  );
}
