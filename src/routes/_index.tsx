import { Button } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { createRecords, deleteRecords, getRecords } from "@/api/querys";
import type { Tables } from "@/types/database.types";

type RecordType = Tables<"study_record">;

// export const Route = createFileRoute("/_index")({
//   component: App,
// });

export function App() {
  // フォームの状態管理
  const [formData, setFormData] = useState({ title: "", time: 0 });
  // レコードの状態管理
  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState<{ fetch: boolean; submit: boolean }>({
    fetch: false,
    submit: false,
  });
  // エラー状態の管理
  const [error, setError] = useState<string>("");

  // Generate unique IDs for form inputs
  const titleInputId = useId();
  const timeInputId = useId();

  // 学習時間の合計値
  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.time;
  }, 0);

  // レコードに学習記録を追加する
  const onCreate = async () => {
    if (formData.title === "" || formData.time <= 0) {
      setError("学習内容と学習時間を入力してください");
      return;
    }

    setError(""); // エラーをクリア
    setLoading((prev) => ({ ...prev, submit: true }));

    const result = await createRecords(formData);

    if (typeof result !== "string") {
      setRecords((prev) => [result, ...prev]);
      setFormData({ title: "", time: 0 });
    } else {
      setError(result);
    }
    setLoading((prev) => ({ ...prev, submit: false }));
    return;
  };

  // 学習記録を削除
  const onDelete = async (id: string) => {
    if (!id) {
      return;
    }
    setLoading((prev) => ({ ...prev, submit: true }));

    const result = await deleteRecords(id);

    if (typeof result !== "string") {
      const newRecords = records.filter((record) => record.id !== result.id);
      setRecords(newRecords);
    } else {
      setError(result);
    }
    setLoading((prev) => ({ ...prev, submit: false }));
    return;
  };

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));

      const result = await getRecords();
      if (typeof result !== "string") {
        setRecords(result);
      } else {
        setError(result);
      }
      setLoading((prev) => ({ ...prev, fetch: false }));
    };
    fetchRecords();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* ヘッダー部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">学習記録一覧</h1>
        </div>

        {/* 記録一覧部分 */}
        {loading.fetch ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
              <span className="text-gray-600">読込中...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            {records.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                まだ学習記録がありません
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={`${record.title}-${record.time}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-gray-900">
                        {record.title}
                      </h3>
                      <p className="text-gray-600">{record.time}時間</p>
                    </div>
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onDelete(record.id)}
                      disabled={loading.submit}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* form 部分 */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">新規登録</h2>

          {/* 学習内容入力 */}
          <div className="mb-4">
            <label
              htmlFor={titleInputId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              学習内容
            </label>
            <input
              id={titleInputId}
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>

          {/* 学習時間入力 */}
          <div className="mb-4">
            <label
              htmlFor={timeInputId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              学習時間（時間）
            </label>
            <input
              id={timeInputId}
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  time: parseInt(e.target.value, 10),
                }))
              }
            />
          </div>

          {/* 入力値の確認表示 */}
          <div className="bg-gray-50 p-4 rounded-md text-sm mb-4">
            <div className="space-y-1">
              <p className="text-gray-600">
                現在の入力:{" "}
                <span className="font-medium text-gray-900">
                  {formData.title || "未入力"}
                </span>
              </p>
              <p className="text-gray-600">
                学習時間:{" "}
                <span className="font-medium text-gray-900">
                  {formData.time}時間
                </span>
              </p>
              <p className="text-gray-600">
                合計学習時間:{" "}
                <span className="font-medium text-gray-900">{sum}時間</span>
              </p>
            </div>
          </div>

          {/* 登録ボタン */}
          <button
            onClick={onCreate}
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading.submit}
          >
            {loading.submit ? "登録中..." : "登録"}
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
