import {
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
import {
  useDeleteStudyrecord,
  useGetLatestStudyRecord,
} from "@/api/study-records-query";
import { StudyRecordDialog } from "@/study-records/study-record-dialog";
import { useStudyRecordDialogForm } from "@/study-records/use-study-record-dialog";

export const Route = createFileRoute("/")({
  component: App,
});

export function App() {
  const {
    dialog,
    mode,
    selectedRecord,
    openCreate,
    openEdit,
    onCancel,
    onSubmit,
    isLoading,
  } = useStudyRecordDialogForm();

  const { data: records, isLoading: isLoadingGetRecords } =
    useGetLatestStudyRecord(5);
  const { mutateAsync: handleDelete, isPending: isPendingDeleteRecords } =
    useDeleteStudyrecord();

  // // 学習時間の合計値
  const sum =
    records?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.time;
    }, 0) ?? 0;

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
        {/* 合計学習時間表示 */}
        <Box
          mb="6"
          p="4"
          bg="white"
          rounded="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text color="gray.600" fontSize="sm" mb="1">
            合計学習時間
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.500"
            fontFamily="sans-serif"
          >
            {sum}
            <Text
              as="span"
              fontSize="lg"
              ml="1"
              color="gray.500"
              fontWeight="normal"
            >
              時間
            </Text>
          </Text>
        </Box>
        {/* 新規作成ボタン */}
        <Box mb={"4"}>
          <Button colorPalette={"blue"} onClick={openCreate}>
            新規登録
          </Button>
        </Box>
        {/* 記録一覧 */}
        {isLoadingGetRecords ? (
          <Card.Root>
            <Card.Body>
              <Flex align={"center"} justify={"center"} py={"8"} gap={"3"}>
                <Spinner size={"md"} colorPalette={"blue"} />
                <Text color={"gray.600"}>読込中...</Text>
              </Flex>
            </Card.Body>
          </Card.Root>
        ) : (
          <Card.Root>
            <Card.Body>
              {records?.length === 0 ? (
                <Text color={"gray.500"} textAlign={"center"} py={"8"}>
                  まだ学習記録がありません
                </Text>
              ) : (
                <VStack gap={"3"} align={"stretch"}>
                  {records?.map((record) => (
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
                            colorPalette={"green"}
                            onClick={() => openEdit(record)}
                          >
                            編集
                          </Button>
                          <Button
                            colorPalette={"red"}
                            size={"sm"}
                            onClick={() => handleDelete(record.id)}
                            loading={isPendingDeleteRecords}
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
          dialog={dialog}
          mode={mode}
          onCancel={onCancel}
          record={selectedRecord}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        {/* エラーメッセージ */}
        {/* {error && (
          <Alert.Root status={"error"} mt={"4"}>
            <Alert.Indicator />
            <Alert.Description fontSize={"sm"}>
              {error instanceof Error ? error.message : "エラーが発生しました"}
            </Alert.Description>
          </Alert.Root>
        )} */}
      </Container>
    </Box>
  );
}
