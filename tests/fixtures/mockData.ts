import type { Tables, TablesInsert } from "@/types/database.types";

export const mockLearningRecords: Array<Tables<"study_record">> = [
  {
    id: "1",
    title: "React学習",
    time: 2,
    created_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "2",
    title: "TypeScript学習",
    time: 1.5,
    created_at: "2025-01-01T14:00:00Z",
  },
  {
    id: "3",
    title: "Vitest学習",
    time: 3,
    created_at: "2025-01-02T09:00:00Z",
  },
];

export const mockCreatedRecord: TablesInsert<"study_record"> = {
  title: "テスト学習記録",
  time: 1,
};
