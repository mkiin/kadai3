import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StudyRecordDialog } from "@/study-records/study-record-dialog";
import { useStudyRecordModal } from "@/study-records/use-study-record-dialog";
import { useStudyRecords, useDeleteStudyRecord } from "@/api/study-records-query";
import type { Tables } from "@/types/database.types";

type RecordType = Tables<"study_record">;

export const Route = createFileRoute("/")({
  component: App,
});

export function App() {
  // モーダルのカスタムフック
  const studyRecordModal = useStudyRecordModal();

  // 編集用のデータ状態
  const [editingRecord, setEditingRecord] = useState<RecordType | undefined>();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // TanStack Queryフック
  const { data: records = [], isLoading, error } = useStudyRecords();
  const deleteMutation = useDeleteStudyRecord();

  // 学習時間の合計値
  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.time;
  }, 0);

  // 新規作成ボタンのハンドラ
  const handleCreate = () => {
    setEditingRecord(undefined);
    setDialogMode("create");
    studyRecordModal.dialog.setOpen(true);
  };

  // 編集ボタンのハンドラ
  const handleEdit = (record: RecordType) => {
    setEditingRecord(record);
    setDialogMode("edit");
    studyRecordModal.dialog.setOpen(true);
  };

  // 削除ボタンのハンドラ
  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <Box
      bg={"gray.50"}
      minH={"100vh"}
      py={"8"}
      px={{ base: "4", sm: "6", lg: "8" }}
    >
      <Container maxW={"4xl"}>
        <Box mb={"8"}>
          <Heading size={"3xl"} color={"gray.900"} fontWeight={"bold"}>
            学習記録一覧
          </Heading>
        </Box>

        {/* 新規作成ボタン */}
        <Box mb={"4"}>
          <Button colorPalette={"blue"} onClick={handleCreate}>
            新規作成
          </Button>
        </Box>

        {/* 合計時間表示 */}
        {records.length > 0 && (
          <Box mb={"4"} p={"4"} bg={"blue.50"} rounded={"lg"}>
            <Text fontWeight={"bold"} color={"blue.900"}>
              合計学習時間: {sum}時間
            </Text>
          </Box>
        )}

        {/* 記録一覧 */}
        {isLoading ? (
          <Card.Root>
            <Card.Body>
              <Flex align={"center"} justify={"center"} py={"8"} gap={"3"}>
                <Spinner size={"lg"} colorPalette={"blue"} />
                <Text color={"gray.600"}>読込中...</Text>
              </Flex>
            </Card.Body>
          </Card.Root>
        ) : (
          <Card.Root>
            <Card.Body>
              {records.length === 0 ? (
                <Text color={"gray.500"} textAlign={"center"} py={"8"}>
                  まだ学習記録がありません
                </Text>
              ) : (
                <VStack gap={"3"} align={"stretch"}>
                  {records.map((record) => (
                    <Box
                      key={record.id}
                      p={"4"}
                      bg={"gray.50"}
                      rounded={"lg"}
                      _hover={{ bg: "gray.100" }}
                      transition={"background-color 0.2s"}
                    >
                      <Flex justify={"space-between"} align={"center"}>
                        <HStack gap={"4"}>
                          <Text fontWeight={"medium"} color={"gray.900"}>
                            {record.title}
                          </Text>
                          <Text color={"gray.600"}>{record.time}時間</Text>
                        </HStack>
                        <HStack gap={"2"}>
                          <Button
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => handleEdit(record)}
                          >
                            編集
                          </Button>
                          <Button
                            colorPalette={"red"}
                            size={"sm"}
                            onClick={() => handleDelete(record.id)}
                            loading={deleteMutation.isPending}
                          >
                            削除
                          </Button>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </Card.Body>
          </Card.Root>
        )}

        {/* 学習記録を登録・編集するモーダル */}
        <StudyRecordDialog
          modalState={studyRecordModal}
          initialData={editingRecord}
          mode={dialogMode}
        />

        {/* エラーメッセージ */}
        {error && (
          <Alert.Root status={"error"} mt={"4"}>
            <Alert.Indicator />
            <Alert.Description fontSize={"sm"}>
              {error instanceof Error ? error.message : "エラーが発生しました"}
            </Alert.Description>
          </Alert.Root>
        )}
      </Container>
    </Box>
  );
}