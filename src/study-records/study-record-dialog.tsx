import { Dialog, Portal } from "@chakra-ui/react";
import type { useStudyRecordModal } from "./use-study-record-dialog";
import type { Tables } from "@/types/database.types";
import { StudyRecordForm } from "./study-record-form";
import { useCreateStudyRecord, useUpdateStudyRecord } from "@/api/study-records-query";

type StudyRecord = Tables<"study_record">;

type StudyRecordDialogProps = {
  modalState: ReturnType<typeof useStudyRecordModal>;
  initialData?: StudyRecord;
  mode?: "create" | "edit";
};

export function StudyRecordDialog({
  modalState,
  initialData,
  mode = "create"
}: StudyRecordDialogProps) {
  const createMutation = useCreateStudyRecord();
  const updateMutation = useUpdateStudyRecord();

  const handleSubmit = async (data: any) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
      } else if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          record: data,
        });
      }
      modalState.dialog.setOpen(false);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog.RootProvider value={modalState.dialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "学習記録を登録" : "学習記録を編集"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <StudyRecordForm
                onSubmit={handleSubmit}
                initialData={initialData}
                isLoading={isLoading}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
