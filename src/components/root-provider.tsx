"use client";
import type React from "react";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";

type RootProviderProps = {
  children: React.ReactNode;
};

export function RootProvider(props: RootProviderProps) {
  return <ChakraUIProvider>{props.children}</ChakraUIProvider>;
}
