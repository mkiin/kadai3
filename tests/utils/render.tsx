// ./testing/render.tsx
import { RootProvider } from "@/components/root-provider"
import { render as rtlRender } from "@testing-library/react"
import { TestRouter } from "./test-routert"

export function render(ui: React.ReactNode) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: React.PropsWithChildren) => (
      <TestRouter component={() => <RootProvider>{props.children}</RootProvider>}/>
    ),
  })
}