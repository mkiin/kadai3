import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { createRecords, deleteRecords, getRecords } from "@/api/querys";
import type { Tables } from "@/types/database.types";

type RecordType = Tables<"study_record">;

export const Route = createFileRoute("/")({
  component: App,
});

export function App() {
  // フォームの状態管理
  const [formData, setFormData] = useState({ title: "", time: 0 });
  // レコードの状態管理
  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState<{ fetch: boolean; submit: boolean }>({
    fetch: false,
    submit: false,
  });
  // エラー状態の管理
  const [error, setError] = useState<string>("");

  // Generate unique IDs for form inputs
  const titleInputId = useId();
  const timeInputId = useId();

  // 学習時間の合計値
  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.time;
  }, 0);

  // レコードに学習記録を追加する
  const onCreate = async () => {
    if (formData.title === "" || formData.time <= 0) {
      setError("学習内容と学習時間を入力してください");
      return;
    }

    setError(""); // エラーをクリア
    setLoading((prev) => ({ ...prev, submit: true }));

    const result = await createRecords(formData);

    if (typeof result !== "string") {
      setRecords((prev) => [result, ...prev]);
      setFormData({ title: "", time: 0 });
    } else {
      setError(result);
    }
    setLoading((prev) => ({ ...prev, submit: false }));
    return;
  };

  // 学習記録を削除
  const onDelete = async (id: string) => {
    if (!id) {
      return;
    }
    setLoading((prev) => ({ ...prev, submit: true }));

    const result = await deleteRecords(id);

    if (typeof result !== "string") {
      const newRecords = records.filter((record) => record.id !== result.id);
      setRecords(newRecords);
    } else {
      setError(result);
    }
    setLoading((prev) => ({ ...prev, submit: false }));
    return;
  };

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));

      const result = await getRecords();
      if (typeof result !== "string") {
        setRecords(result);
      } else {
        setError(result);
      }
      setLoading((prev) => ({ ...prev, fetch: false }));
    };
    fetchRecords();
  }, []);

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
        {/* 記録一覧 */}
        {loading.fetch ? (
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
                      key={`${record.title}-${record.time}`}
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
                        <Button
                          colorPalette={"red"}
                          size={"sm"}
                          onClick={() => onDelete(record.id)}
                          disabled={loading.submit}
                          loading={loading.submit}
                        >
                          削除
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </Card.Body>
          </Card.Root>
        )}

        {/* form 部分 */}
        <Card.Root mt={"6"}>
          <Card.Header>
            <Heading size={"lg"} color={"gray.900"}>
              新規登録
            </Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={"4"}>
              {/* 学習内容入力 */}
              <Field.Root>
                <Field.Label
                  htmlFor={titleInputId}
                  fontSize={"sm"}
                  fontWeight={"medium"}
                  color={"gray.700"}
                >
                  学習内容
                </Field.Label>
                <Input
                  id={titleInputId}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="学習内容を入力"
                />
              </Field.Root>
              {/* 学習時間入力 */}
              <Field.Root>
                <Field.Label
                  htmlFor={timeInputId}
                  fontSize={"sm"}
                  fontWeight={"medium"}
                  color={"gray.700"}
                >
                  学習時間(時間)
                </Field.Label>
                <Input
                  id={timeInputId}
                  type="number"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      time: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </Field.Root>

              {/* 入力値の確認表示 */}
              <Box bg={"gray.50"} p={"4"} rounded={"md"}>
                <VStack gap={"1"} align={"start"}>
                  <Text fontSize={"sm"} color={"gray.600"}>
                    現在の入力：{" "}
                    <Text as={"span"} fontWeight={"medium"} color={"gray.900"}>
                      {formData.time || "未入力"}
                    </Text>
                  </Text>
                  <Text fontSize={"sm"} color={"gray.600"}>
                    学習時間：{" "}
                    <Text as={"span"} fontWeight={"medium"} color={"gray.900"}>
                      {formData.time}時間
                    </Text>
                  </Text>
                  <Text fontSize={"sm"} color={"gray.600"}>
                    合計時間:{" "}
                    <Text as={"span"} fontWeight={"medium"} color={"gray.900"}>
                      {sum}時間
                    </Text>
                  </Text>
                </VStack>
              </Box>
              {/* 登録ボタン */}
              <Button
                onClick={onCreate}
                colorPalette={"blue"}
                size={"lg"}
                width={"full"}
                disabled={loading.submit}
                loading={loading.submit}
                loadingText="登録中"
              >
                登録
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
        {/* エラーメッセージ */}
        {error && (
          <Alert.Root status={"error"} mt={"4"}>
            <Alert.Indicator />
            <Alert.Description fontSize={"sm"}>{error}</Alert.Description>
          </Alert.Root>
        )}
      </Container>
    </Box>
  );
}
