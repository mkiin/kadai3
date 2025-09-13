import type { Tables } from "@/types/database.types";

type RecordType = Tables<"study_record">;

export const mockLearningRecords: RecordType[] = [
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

export const mockNewRecord: Omit<RecordType, "id" | "created_at"> = {
  title: "新しい学習",
  time: 1,
};

export const mockCreatedRecord: RecordType = {
  id: "4",
  title: "新しい学習",
  time: 4,
  created_at: "2025-01-03T10:00:00Z",
};
