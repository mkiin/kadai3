// tests/routes/index.test.tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mockLearningRecords } from "tests/fixtures/mockData";
import Wrapper from "tests/utils/wrapper";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteStudyRecord,
  getLatestStudyRecords,
} from "@/api/study-record-query";
import { App } from "@/routes";

// API関数のみモック
vi.mock(import("@/api/study-record-query"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getLatestStudyRecords: vi.fn(),
    deleteStudyRecord: vi.fn(),
  };
});

describe("Appコンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getLatestStudyRecords).mockResolvedValue(mockLearningRecords); // 帰り値設定
  });

  it("タイトルがあること", async () => {
    render(<App />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: "学習記録一覧" }),
    ).toBeInTheDocument();
  });
  it("新規登録ボタンがある", async () => {
    render(<App />, { wrapper: Wrapper });

    const newRecordButton = screen.getByRole("button", { name: "新規登録" });
    expect(newRecordButton).toBeInTheDocument();
  });
  it("テーブルをみることができる(リスト)", async () => {
    render(<App />, { wrapper: Wrapper });

    await waitFor(() => {
      // 学習記録名と時間が表示されるか
      expect(
        screen.getByText(mockLearningRecords[0].title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${mockLearningRecords[0].time}時間`),
      ).toBeInTheDocument();

      // 編集と削除ボタンが表示されるか、表示された分だけボタンが有るか確認
      expect(screen.getAllByRole("button", { name: "編集" })).toHaveLength(
        mockLearningRecords.length,
      );
      expect(screen.getAllByRole("button", { name: "削除" })).toHaveLength(
        mockLearningRecords.length,
      );
    });
  });

  it("ローディング画面が表示される", async () => {
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

  it("削除ができること", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: Wrapper });

    // データが読み込まれるまで待機
    await waitFor(() => {
      expect(
        screen.getByText(mockLearningRecords[0].title),
      ).toBeInTheDocument();
    });

    // 削除ボタンを取得
    const delteButtons = screen.getAllByRole("button", { name: "削除" });
    // 削除ボタンをクリック
    await user.click(delteButtons[0]);

    // delteStudyRecordが正しい引数で呼ばれるか確認
    await waitFor(() => {
      expect(vi.mocked(deleteStudyRecord)).toHaveBeenCalledWith(
        mockLearningRecords[0].id,
      );
    });
  });
});

describe("ダイアログ表示", () => {
  it("新規登録ボタンをクリックし新規登録ダイアログが表示される", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: Wrapper });

    // 新規登録ボタンをクリック
    const newButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(newButton);

    //新規登録ダイアログが表示
    await waitFor(() => {
      expect(
        within(screen.getByRole("dialog")).getByText("新規登録"),
      ).toBeInTheDocument();
    });
  });
  it("編集ボタンをクリックし編集ダイアログが表示される", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: Wrapper });

    // 学習記録一覧が表示されるまで待機
    await waitFor(() => {
      expect(
        screen.getByText(mockLearningRecords[0].title),
      ).toBeInTheDocument();
    });

    // 編集ボタンをクリック
    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await user.click(editButtons[0]);

    //編集ダイアログが表示
    await waitFor(() => {
      expect(
        within(screen.getByRole("dialog")).getByText("記録編集"),
      ).toBeInTheDocument();
    });
  });
});
