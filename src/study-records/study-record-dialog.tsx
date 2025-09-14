import { Dialog, Portal, type UseDialogReturn } from "@chakra-ui/react";
import type { Tables, TablesInsert } from "@/types/database.types";
import { StudyRecordForm } from "./study-record-form";

type StudyRecordDialogProps = {
  dialog: UseDialogReturn;
  onCancel: () => void;
  mode: "create" | "edit";
  record?: Tables<"study_record">;
  onSubmit: (data: TablesInsert<"study_record">) => void;
  isLoading?: boolean;
};

export function StudyRecordDialog({
  dialog,
  onCancel,
  mode,
  record,
  onSubmit,
  isLoading,
}: StudyRecordDialogProps) {
  return (
    <Dialog.RootProvider value={dialog}>
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
                mode={mode}
                defaultValues={record}
                onSubmit={onSubmit}
                onCancel={onCancel}
                isLoading={isLoading}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
