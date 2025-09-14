import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ReactNode } from "react";

type RootProviderProps = {
  children: ReactNode;
};

export function Provider(props: RootProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
  );
}
