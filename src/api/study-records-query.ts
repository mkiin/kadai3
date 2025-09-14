// supabaseと通信およびTanstack Queryの関数エクスポート

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

/**
 *
 * @param limit 取得する最新の学習記録の個数
 * @returns 取得した最新の学習記録
 */
const getLatestStudyRecords = async (limit: number) => {
  const { data: result, error } = await supabase
    .from("study_record")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return result;
};

/**
 *
 * @param data : 新たに作成する学習記録のデータ
 * @returns : result : 作成できた学習記録のデータ
 */
const createStudyRecord = async (data: TablesInsert<"study_record">) => {
  const { data: result, error } = await supabase
    .from("study_record")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
};

/**
 *
 * @param id 編集する学習記録のid
 * @param data 編集する学習記録の内容
 * @returns 編集出来た学習記録の内容
 */
const updateStudyRecord = async (
  id: string,
  data: TablesUpdate<"study_record">,
) => {
  const { data: result, error } = await supabase
    .from("study_record")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
};

const deleteStudyRecord = async (id: string) => {
  const { data: result, error } = await supabase
    .from("study_record")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result;
};

export const useStudyRecordMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createStudyRecord,
    onSuccess: () => {
      // 学習記録一覧のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: ["study-records"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"study_record">;
    }) => updateStudyRecord(id, data),
    onSuccess: () => {
      // 学習記録一覧のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: ["study-records"],
      });
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
  };
};

export const useDeleteStudyrecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudyRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-records"] });
    },
    onError: (error) => {
      console.error("Failed to update study record:", error);
    },
  });
};

export const useGetLatestStudyRecord = (limit: number = 5) => {
  return useSuspenseQuery({
    queryKey: ["study-records", "latest", limit],
    queryFn: () => getLatestStudyRecords(limit),
  });
};
