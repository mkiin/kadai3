// tests/components/study-record-form.test.tsx
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { mockSingleRecord } from "tests/fixtures/mockData";
import Wrapper from "tests/utils/wrapper";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStudyRecord, updateStudyRecord } from "@/api/study-record-query";
import { StudyRecordForm } from "@/study-records/study-record-form";

// API関数をモック
vi.mock("@/api/study-record-query", () => ({
  createStudyRecord: vi.fn(),
  updateStudyRecord: vi.fn(),
  getLatestStudyRecords: vi.fn(),
  deleteStudyRecord: vi.fn(),
}));

describe("StudyRecordForm", () => {
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("作成モード", () => {
    // 作成モード用のhandleSubmitを定義
    const handleSubmit = async (data: { title: string; time: number }) => {
      await createStudyRecord(data);
    };

    beforeEach(() => {
      vi.mocked(createStudyRecord).mockResolvedValue(mockSingleRecord);
    });

    it("登録できること", async () => {
      const user = userEvent.setup();

      render(
        <StudyRecordForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // フォームに入力
      const titleInput = screen.getByLabelText("学習内容");
      const timeInput = screen.getByLabelText("学習時間（時間）");

      await user.type(titleInput, mockSingleRecord.title);
      await user.clear(timeInput);
      await user.type(timeInput, mockSingleRecord.time.toString(10)); // モック用のデータを数値から文字列へ

      // 登録ボタンをクリック
      const submitButton = screen.getByRole("button", { name: "登録" });
      await user.click(submitButton);

      // createStudyRecordが正しい引数で呼ばれることを確認
      await waitFor(() => {
        expect(createStudyRecord).toHaveBeenCalledWith({
          title: mockSingleRecord.title,
          time: mockSingleRecord.time,
        });
      });
    });

    it("学習内容がないときに登録するとエラーがでる", async () => {
      const user = userEvent.setup();

      render(
        <StudyRecordForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // 学習時間だけ入力
      const timeInput = screen.getByLabelText("学習時間（時間）");
      await user.clear(timeInput);
      await user.type(timeInput, mockSingleRecord.time.toString(10)); // モック用のデータを数値から文字列へ

      // 登録ボタンをクリック
      const submitButton = screen.getByRole("button", { name: "登録" });
      await user.click(submitButton);

      // エラーメッセージが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
      });

      // createStudyRecordが呼ばれないことを確認
      expect(createStudyRecord).not.toHaveBeenCalled();
    });

    describe("学習時間がないときに登録するとエラーがでる", () => {
      it("未入力のエラー", async () => {
        const user = userEvent.setup();

        render(
          <StudyRecordForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={mockOnCancel}
          />,
          { wrapper: Wrapper },
        );

        // 学習内容だけ入力
        const titleInput = screen.getByLabelText("学習内容");
        await user.type(titleInput, "学習内容");

        // 時間フィールドをクリアして空にする
        const timeInput = screen.getByLabelText("学習時間（時間）");
        await user.clear(timeInput);

        // 登録ボタンをクリック
        const submitButton = screen.getByRole("button", { name: "登録" });
        await user.click(submitButton);

        // エラーメッセージが表示されることを確認
        await waitFor(() => {
          expect(
            screen.getByText("時間の入力は必須です。"),
          ).toBeInTheDocument();
        });

        // createStudyRecordが呼ばれないことを確認
        expect(createStudyRecord).not.toHaveBeenCalled();
      });

      it("0以上でないときのエラー", async () => {
        const user = userEvent.setup();

        render(
          <StudyRecordForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={mockOnCancel}
          />,
          { wrapper: Wrapper },
        );

        // フォームに入力
        const titleInput = screen.getByLabelText("学習内容");
        const timeInput = screen.getByLabelText("学習時間（時間）");
        await user.type(titleInput, "学習内容");
        await user.clear(timeInput);
        await user.type(timeInput, "-1");

        // 登録ボタンをクリック
        const submitButton = screen.getByRole("button", { name: "登録" });
        await user.click(submitButton);

        // エラーメッセージが表示されることを確認
        await waitFor(() => {
          expect(
            screen.getByText("時間は0以上である必要があります。"),
          ).toBeInTheDocument();
        });

        // createStudyRecordが呼ばれないことを確認
        expect(createStudyRecord).not.toHaveBeenCalled();
      });
    });

    it("キャンセルボタンが機能すること", async () => {
      const user = userEvent.setup();

      render(
        <StudyRecordForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // キャンセルボタンをクリック
      const cancelButton = screen.getByRole("button", { name: "キャンセル" });
      await user.click(cancelButton);

      // onCancelが呼ばれることを確認
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("編集モード", () => {
    // 編集モード用のhandleSubmitを定義
    const handleSubmit = async (data: { title: string; time: number }) => {
      await updateStudyRecord(mockSingleRecord.id, data);
    };

    beforeEach(() => {
      // updateStudyRecordのモックを設定
      vi.mocked(updateStudyRecord).mockResolvedValue({
        id: mockSingleRecord.id,
        title: "更新された記録",
        time: 10,
        created_at: mockSingleRecord.created_at,
      });
    });

    it("編集して登録すると更新される", async () => {
      const user = userEvent.setup();

      render(
        <StudyRecordForm
          mode="edit"
          defaultValues={mockSingleRecord}
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // デフォルト値が設定されていることを確認
      const titleInput = screen.getByLabelText("学習内容");
      const timeInput = screen.getByLabelText("学習時間（時間）");

      expect(titleInput).toHaveValue(mockSingleRecord.title);
      expect(timeInput).toHaveValue(mockSingleRecord.time);

      // 値を更新
      await user.clear(titleInput);
      await user.type(titleInput, "更新された記録");
      await user.clear(timeInput);
      await user.type(timeInput, "10");

      // 更新ボタンをクリック
      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // updateStudyRecordが正しい引数で呼ばれることを確認
      await waitFor(() => {
        expect(updateStudyRecord).toHaveBeenCalledWith(mockSingleRecord.id, {
          title: "更新された記録",
          time: 10,
        });
      });
    });

    it("編集モードでもバリデーションが機能すること", async () => {
      const user = userEvent.setup();

      render(
        <StudyRecordForm
          mode="edit"
          defaultValues={mockSingleRecord}
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // タイトルをクリアして空にする
      const titleInput = screen.getByLabelText("学習内容");
      await user.clear(titleInput);

      // 更新ボタンをクリック
      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // エラーメッセージが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
      });

      // updateStudyRecordが呼ばれないことを確認
      expect(updateStudyRecord).not.toHaveBeenCalled();
    });
  });

  describe("プレビュー機能", () => {
    it("入力内容がリアルタイムでプレビューに反映される", async () => {
      const user = userEvent.setup();

      // 作成モード用のhandleSubmitを使用
      const handleSubmit = async (data: { title: string; time: number }) => {
        await createStudyRecord(data);
      };

      render(
        <StudyRecordForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={mockOnCancel}
        />,
        { wrapper: Wrapper },
      );

      // 初期状態の確認
      expect(screen.getByText("未入力")).toBeInTheDocument();
      expect(screen.getByText("0時間")).toBeInTheDocument();

      // フォームに入力
      const titleInput = screen.getByLabelText("学習内容");
      const timeInput = screen.getByLabelText("学習時間（時間）");

      await user.type(titleInput, "プレビューテスト");
      await user.clear(timeInput);
      await user.type(timeInput, "7");

      // プレビューに反映されることを確認
      await waitFor(() => {
        expect(screen.getByText("プレビューテスト")).toBeInTheDocument();
        expect(screen.getByText("7時間")).toBeInTheDocument();
      });
    });
  });
});
