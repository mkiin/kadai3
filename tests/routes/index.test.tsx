// tests/routes/index.test.tsx
import { cleanup, screen } from "@testing-library/react";
import { render } from "../utils/render";
import userEvent from "@testing-library/user-event";
// import { createRecords, deleteRecords, getRecords } from "@/api/querys";
import { App } from "@/routes/index";
// import { mockCreatedRecord, mockLearningRecords } from "../fixtures/mockData";

// Supabase API関数をモック化
vi.mock("@/api/querys", () => ({
  getRecords: vi.fn(),
  createRecords: vi.fn(),
  deleteRecords: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});

describe("学習記録アプリ", () => {
  it("タイトルが正しく表示される", async () => {
    render(<App />);

    expect(await screen.findByText("学習記録一覧")).toBeInTheDocument();
  });

  // it("フォームに入力して登録すると新しい記録が追加される", async () => {
  //   const user = userEvent.setup();

  //   // モック関数の戻り値を設定
  //   // 初期状態では記録が0件
  //   vi.mocked(getRecords).mockResolvedValue([]);

  //   // createRecordsが成功した時の戻り値を設定
  //   vi.mocked(createRecords).mockResolvedValue(mockCreatedRecord);

  //   // ルーターとコンポーネントをレンダリング

  //   render(<RouterProvider router={router} />);

  //   // 初期状態の確認（記録が0件）
  //   expect(
  //     await screen.findByText("まだ学習記録がありません"),
  //   ).toBeInTheDocument();

  //   // フォームに入力
  //   const titleInput = screen.getByLabelText("学習内容");
  //   const timeInput = screen.getByLabelText("学習時間（時間）");

  //   await user.type(titleInput, "新しい学習");
  //   await user.clear(timeInput); // デフォルト値をクリア
  //   await user.type(timeInput, "4");

  //   // 登録ボタンをクリック
  //   const submitButton = screen.getByRole("button", { name: "登録" });
  //   await user.click(submitButton);

  //   // 新しい記録が表示されることを確認
  //   await waitFor(() => {
  //     expect(screen.getByText("新しい学習")).toBeInTheDocument();
  //     // 複数の「4時間」が表示される可能性があるので、getAllByTextを使用
  //     const timeElements = screen.getAllByText("4時間");
  //     expect(timeElements.length).toBeGreaterThan(0);
  //   });

  //   // 「まだ学習記録がありません」が表示されなくなることを確認
  //   expect(
  //     screen.queryByText("まだ学習記録がありません"),
  //   ).not.toBeInTheDocument();

  //   // createRecordsが正しい引数で呼ばれたことを確認
  //   expect(createRecords).toHaveBeenCalledWith({
  //     title: "新しい学習",
  //     time: 4,
  //   });
  // });

  // it("削除ボタンを押すと学習記録が削除される", async () => {
  //   const user = userEvent.setup();

  //   // 初期状態で3件のレコードを表示
  //   vi.mocked(getRecords).mockResolvedValue(mockLearningRecords);

  //   // deleteRecordsが成功した時の戻り値を設定（削除された最初のレコード）
  //   vi.mocked(deleteRecords).mockResolvedValue(mockLearningRecords[0]);

  //   // ルーターとコンポーネントをレンダリング
  //   const { router } = createTestRouter();
  //   await router.load();
  //   render(<RouterProvider router={router} />);

  //   // 初期状態で3件のレコードが表示されることを確認
  //   expect(await screen.findByText("React学習")).toBeInTheDocument();
  //   expect(screen.getByText("TypeScript学習")).toBeInTheDocument();
  //   expect(screen.getByText("Vitest学習")).toBeInTheDocument();

  //   // 削除ボタンを取得（複数あるため、最初のボタンを取得）
  //   const deleteButtons = screen.getAllByRole("button", { name: "削除" });
  //   expect(deleteButtons).toHaveLength(3);

  //   // 最初の削除ボタンをクリック（React学習を削除）
  //   await user.click(deleteButtons[0]);

  //   // deleteRecordsが正しいIDで呼ばれたことを確認
  //   expect(deleteRecords).toHaveBeenCalledWith("1");

  //   // React学習が削除されて表示されなくなることを確認
  //   await waitFor(() => {
  //     expect(screen.queryByText("React学習")).not.toBeInTheDocument();
  //   });

  //   // 他の2件は引き続き表示されることを確認
  //   expect(screen.getByText("TypeScript学習")).toBeInTheDocument();
  //   expect(screen.getByText("Vitest学習")).toBeInTheDocument();

  //   // 削除ボタンが2つに減っていることを確認
  //   const remainingDeleteButtons = screen.getAllByRole("button", {
  //     name: "削除",
  //   });
  //   expect(remainingDeleteButtons).toHaveLength(2);
  // });

  // it("入力をしないで登録を押すとエラーが表示される", async () => {
  //   const user = userEvent.setup();

  //   // 初期状態では記録が0件
  //   vi.mocked(getRecords).mockResolvedValue([]);

  //   // ルーターとコンポーネントをレンダリング
  //   const { router } = createTestRouter();
  //   await router.load();
  //   render(<RouterProvider router={router} />);

  //   // 初期状態の確認
  //   expect(
  //     await screen.findByText("まだ学習記録がありません"),
  //   ).toBeInTheDocument();

  //   // フォームの初期値を確認（titleは空、timeは0）
  //   const titleInput = screen.getByLabelText("学習内容");
  //   const timeInput = screen.getByLabelText("学習時間（時間）");

  //   expect(titleInput).toHaveValue("");
  //   expect(timeInput).toHaveValue(0);

  //   // 何も入力せずに登録ボタンをクリック
  //   const submitButton = screen.getByRole("button", { name: "登録" });
  //   await user.click(submitButton);

  //   // エラーメッセージが表示されることを確認
  //   expect(
  //     await screen.findByText("学習内容と学習時間を入力してください"),
  //   ).toBeInTheDocument();

  //   // createRecordsが呼ばれていないことを確認
  //   expect(createRecords).not.toHaveBeenCalled();

  //   // タイトルだけ入力して登録を押す
  //   await user.type(titleInput, "テスト学習");
  //   await user.click(submitButton);

  //   // まだエラーが表示されることを確認（時間が0のため）
  //   expect(
  //     screen.getByText("学習内容と学習時間を入力してください"),
  //   ).toBeInTheDocument();

  //   // createRecordsがまだ呼ばれていないことを確認
  //   expect(createRecords).not.toHaveBeenCalled();

  //   // 時間も入力して登録を押す
  //   await user.clear(timeInput);
  //   await user.type(timeInput, "2");

  //   // 成功時の戻り値を設定
  //   vi.mocked(createRecords).mockResolvedValue({
  //     id: "test-id",
  //     title: "テスト学習",
  //     time: 2,
  //     created_at: "2025-01-01T10:00:00Z",
  //   });

  //   await user.click(submitButton);

  //   // エラーメッセージが消えることを確認
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByText("学習内容と学習時間を入力してください"),
  //     ).not.toBeInTheDocument();
  //   });

  //   // createRecordsが呼ばれたことを確認
  //   expect(createRecords).toHaveBeenCalledWith({
  //     title: "テスト学習",
  //     time: 2,
  //   });
  // });
});
