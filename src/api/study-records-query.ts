import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

type StudyRecord = Tables<"study_record">;
type InsertStudyRecord = TablesInsert<"study_record">;
type UpdateStudyRecord = TablesUpdate<"study_record">;

// Query Keys
export const studyRecordKeys = {
  all: ["study-records"] as const,
  lists: () => [...studyRecordKeys.all, "list"] as const,
  list: (filters?: any) => [...studyRecordKeys.lists(), filters] as const,
  details: () => [...studyRecordKeys.all, "detail"] as const,
  detail: (id: string) => [...studyRecordKeys.details(), id] as const,
};

// データ取得関数
const fetchStudyRecords = async (): Promise<StudyRecord[]> => {
  const { data, error } = await supabase
    .from("study_record")
    .select("id, title, time, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

// 単一レコード取得関数
const fetchStudyRecord = async (id: string): Promise<StudyRecord> => {
  const { data, error } = await supabase
    .from("study_record")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// レコード作成関数
const createStudyRecord = async (
  record: InsertStudyRecord,
): Promise<StudyRecord> => {
  const { data, error } = await supabase
    .from("study_record")
    .insert({
      title: record.title,
      time: record.time,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// レコード更新関数
const updateStudyRecord = async ({
  id,
  record,
}: {
  id: string;
  record: UpdateStudyRecord;
}): Promise<StudyRecord> => {
  const { data, error } = await supabase
    .from("study_record")
    .update({
      title: record.title,
      time: record.time,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// レコード削除関数
const deleteStudyRecord = async (id: string): Promise<StudyRecord> => {
  const { data, error } = await supabase
    .from("study_record")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// カスタムフック

// 学習記録一覧を取得
export const useStudyRecords = () => {
  return useQuery({
    queryKey: studyRecordKeys.lists(),
    queryFn: fetchStudyRecords,
  });
};

// 単一の学習記録を取得
export const useStudyRecord = (id: string) => {
  return useQuery({
    queryKey: studyRecordKeys.detail(id),
    queryFn: () => fetchStudyRecord(id),
    enabled: !!id,
  });
};

// 学習記録を作成
export const useCreateStudyRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudyRecord,
    onSuccess: (newRecord) => {
      // キャッシュを更新
      queryClient.setQueryData<StudyRecord[]>(
        studyRecordKeys.lists(),
        (oldData) => {
          if (!oldData) return [newRecord];
          return [newRecord, ...oldData];
        },
      );
    },
    onError: (error: PostgrestError) => {
      console.error("Failed to create study record:", error.message);
    },
  });
};

// 学習記録を更新
export const useUpdateStudyRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudyRecord,
    onSuccess: (updatedRecord) => {
      // リストのキャッシュを更新
      queryClient.setQueryData<StudyRecord[]>(
        studyRecordKeys.lists(),
        (oldData) => {
          if (!oldData) return [updatedRecord];
          return oldData.map((record) =>
            record.id === updatedRecord.id ? updatedRecord : record,
          );
        },
      );
      // 詳細のキャッシュも更新
      queryClient.setQueryData(
        studyRecordKeys.detail(updatedRecord.id),
        updatedRecord,
      );
    },
    onError: (error: PostgrestError) => {
      console.error("Failed to update study record:", error.message);
    },
  });
};

// 学習記録を削除
export const useDeleteStudyRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudyRecord,
    onSuccess: (deletedRecord) => {
      // キャッシュから削除
      queryClient.setQueryData<StudyRecord[]>(
        studyRecordKeys.lists(),
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter((record) => record.id !== deletedRecord.id);
        },
      );
      // 詳細のキャッシュも無効化
      queryClient.invalidateQueries({
        queryKey: studyRecordKeys.detail(deletedRecord.id),
      });
    },
    onError: (error: PostgrestError) => {
      console.error("Failed to delete study record:", error.message);
    },
  });
};
