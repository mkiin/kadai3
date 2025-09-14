import { useDialog } from "@chakra-ui/react";
import { useState } from "react";

/**
 * やりたいこと
 * 作成時にモーダルを開く関数を作成
 * 編集時にモーダルを開く関数を作成
 * モーダルを閉じる関数を作成
 */
export const useStudyRecordModal = () => {
  const dialog = useDialog();
  const [mode, setMode] = useState<"create" | "edit">("create");
  const openCreate = () => {
    setMode("create");
    dialog.setOpen(true);
  };

  const openEdit = () => {
    setMode("edit");
    dialog.setOpen(false);
  };

  const close = () => {
    dialog.setOpen(false);
  };

  return {
    dialog,
    mode,
    openCreate,
    openEdit,
    close,
  };
};
