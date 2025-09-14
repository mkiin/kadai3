"use client";
import type React from "react";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";

type RootProviderProps = {
  children: React.ReactNode;
};

export function RootProvider(props: RootProviderProps) {
  const queryClient = createQueryClient();
  return (
    <ChakraUIProvider>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </ChakraUIProvider>
  );
}
