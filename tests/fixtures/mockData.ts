// tests/fixtures/mockData.ts
import type { Tables } from "@/types/database.types";

export const mockLearningRecords: Tables<"study_record">[] = [
  {
    id: "1",
    title: "React Hooks の学習",
    time: 3,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "TypeScript 基礎",
    time: 2,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    title: "Vitest テスト実装",
    time: 4,
    created_at: "2024-01-03T00:00:00Z",
  },
];

export const mockEmptyRecords: Tables<"study_record">[] = [];

export const mockSingleRecord: Tables<"study_record"> = {
  id: "test-id",
  title: "テスト用記録",
  time: 1,
  created_at: "2024-01-04T00:00:00Z",
};
