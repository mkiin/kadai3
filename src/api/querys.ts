import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { TablesInsert as TablesInsertType } from "@/types/database.types";

type InsertRecordType = TablesInsertType<"study_record">;

export const getRecords = async () => {
  try {
    const { data, error } = await supabase
      .from("study_record")
      .select("id, title, time, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};

export const createRecords = async (record: InsertRecordType) => {
  try {
    const { data, error } = await supabase
      .from("study_record")
      .insert({
        title: record.title,
        time: record.time,
      })
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};

/**
 * ボタンを押す
 */

export const deleteRecords = async (RecordId: string) => {
  try {
    const { data, error } = await supabase
      .from("study_record")
      .delete()
      .eq("id", RecordId)
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    if (error instanceof PostgrestError) {
      return error.message;
    } else {
      return "エラーが発生しました";
    }
  }
};
