// supabaseと通信およびTanstack Queryの関数エクスポート

import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

/**
 *
 * @param limit 取得する最新の学習記録の個数
 * @returns 取得した最新の学習記録
 */
export const getLatestStudyRecords = async (limit: number) => {
  try {
    const { data: result, error } = await supabase
      .from("study_record")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return result;
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};

/**
 *
 * @param data : 新たに作成する学習記録のデータ
 * @returns : result : 作成できた学習記録のデータ
 */
export const createStudyRecord = async (data: TablesInsert<"study_record">) => {
  try {
    const { data: result, error } = await supabase
      .from("study_record")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};

/**
 *
 * @param id 編集する学習記録のid
 * @param data 編集する学習記録の内容
 * @returns 編集出来た学習記録の内容
 */
export const updateStudyRecord = async (
  id: string,
  data: TablesUpdate<"study_record">,
) => {
  try {
    const { data: result, error } = await supabase
      .from("study_record")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};

export const deleteStudyRecord = async (id: string) => {
  try {
    const { data: result, error } = await supabase
      .from("study_record")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result;
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};
