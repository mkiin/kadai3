// tests/routes/index.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import Wrapper from "tests/utils/wrapper";
import { App } from "@/routes";
import {
  createStudyRecord,
  deleteStudyRecord,
  getLatestStudyRecords,
  updateStudyRecord,
} from "@/api/study-record-query";
import { mockLearningRecords } from "tests/fixtures/mockData";

// API関数のみモック
vi.mock("@/api/study-record-query", () => ({
  getLatestStudyRecords: vi.fn(),
  createStudyRecord: vi.fn(),
  deleteStudyRecord: vi.fn(),
  updateStudyRecord: vi.fn(),
}));

describe("学習記録アプリ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("タイトル(学習記録一覧)が表示される", async () => {
    // 成功レスポンスをモック
    vi.mocked(getLatestStudyRecords).mockResolvedValue(mockLearningRecords);

    render(<App />, { wrapper: Wrapper });

    expect(screen.getByText("学習記録一覧")).toBeInTheDocument();
  });

  it("ローディング画面が表示される", async () => {
    // 遅延レスポンスでローディング状態を作成
    vi.mocked(getLatestStudyRecords).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockLearningRecords), 1000),
        ),
    );

    render(<App />, { wrapper: Wrapper });

    // ローディング表示を確認
    expect(screen.getByText("読込中...")).toBeInTheDocument();
  });
});
