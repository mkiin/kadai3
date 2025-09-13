// tests/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// 各テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// // // Supabaseの型定義に合わせたモック
// // vi.mock('@/lib/supabase', () => ({
// //   supabase: {
// //     from: vi.fn(() => ({
// //       select: vi.fn().mockReturnThis(),
// //       insert: vi.fn().mockReturnThis(),
// //       delete: vi.fn().mockReturnThis(),
// //       eq: vi.fn().mockReturnThis(),
// //       single: vi.fn(),
// //     })),
// //   },
// // }))

// // // querys.tsのグローバルモック（全テスト共通）
// // vi.mock('@/routes/querys', () => ({
// //   getRecords: vi.fn(),
// //   createRecords: vi.fn(),
// //   deleteRecords: vi.fn(),
// // }))

// // // フェッチAPIのモック（必要に応じて）
// // global.fetch = vi.fn()

// // // ブラウザAPIのモック
// // beforeAll(() => {
// //   // ResizeObserver のモック
// //   global.ResizeObserver = vi.fn().mockImplementation(() => ({
// //     observe: vi.fn(),
// //     unobserve: vi.fn(),
// //     disconnect: vi.fn(),
// //   }))

// //   // IntersectionObserver のモック
// //   global.IntersectionObserver = vi.fn().mockImplementation(() => ({
// //     observe: vi.fn(),
// //     unobserve: vi.fn(),
// //     disconnect: vi.fn(),
// //   }))
// // })
