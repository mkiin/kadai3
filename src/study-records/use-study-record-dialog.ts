import { useDialog } from "@chakra-ui/react";
import { useState } from "react";
import {
  useCreateStudyrecord,
  useUpdateStudyrecord,
} from "@/study-records/use-study-record-query";
import type { Tables } from "@/types/database.types";

type StudyRecordFormData = {
  title: string;
  time: number;
};

export const useStudyRecordDialogForm = () => {
  const dialog = useDialog();
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedRecord, setSelectedRecord] = useState<
    Tables<"study_record"> | undefined
  >();
  const { mutateAsync: create, isPending: isCreating } = useCreateStudyrecord();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateStudyrecord();

  const openCreate = () => {
    setMode("create");
    setSelectedRecord(undefined);
    dialog.setOpen(true);
  };

  const openEdit = (record: Tables<"study_record">) => {
    setMode("edit");
    setSelectedRecord(record);
    dialog.setOpen(true);
  };

  const onCancel = () => {
    dialog.setOpen(false);
    // クローズ時にリセット
    setSelectedRecord(undefined);
  };

  const onSubmit = async (data: StudyRecordFormData) => {
    try {
      if (mode === "create") {
        await create({
          title: data.title,
          time: data.time,
        });
      } else if (mode === "edit" && selectedRecord?.id) {
        await update({
          id: selectedRecord.id,
          data: {
            title: data.title,
            time: data.time,
          },
        });
      }
      onCancel();
    } catch (error) {
      console.error("Failed to save study record:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return {
    dialog,
    mode,
    selectedRecord,
    openCreate,
    openEdit,
    onCancel,
    onSubmit,
    isLoading,
  };
};
