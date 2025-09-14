// tests/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest"
import { JSDOM } from "jsdom"
import ResizeObserver from "resize-observer-polyfill"

// 各テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const { window } = new JSDOM()

vi.stubGlobal("ResizeObserver", ResizeObserver)
window["ResizeObserver"] = ResizeObserver

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60)
window.Element.prototype.scrollIntoView = () => {}

Object.assign(global, { window, document: window.document })