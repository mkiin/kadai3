import {
  Button,
  Field,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { Tables } from "@/types/database.types";

type StudyRecordFormData = {
  title: string;
  time: number;
};

type StudyRecordFormProps = {
  mode: "create" | "edit";
  defaultValues?: Tables<"study_record">;
  onSubmit: (data: StudyRecordFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export function StudyRecordForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: StudyRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<StudyRecordFormData>({
    mode: "onChange",
    defaultValues: {
      title: defaultValues?.title ?? "",
      time: defaultValues?.time ?? 0,
    },
  });

  // リアルタイムでフォーム値を監視
  const watchedValues = watch();

  const handleFormSubmit = async (data: StudyRecordFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="6">
        {/* 学習内容入力 */}
        <Field.Root invalid={!!errors.title}>
          <Field.Label htmlFor="title">学習内容</Field.Label>
          <Input
            placeholder="例: React Hooks の学習"
            {...register("title", {
              required: "内容の入力は必須です",
              minLength: {
                value: 1,
                message: "1文字以上入力してください",
              },
              maxLength: {
                value: 100,
                message: "100文字以下で入力してください",
              },
            })}
          />
          {errors.title && (
            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* 学習時間入力 */}
        <Field.Root invalid={!!errors.time}>
          <Field.Label htmlFor="time">学習時間（時間）</Field.Label>
          <Input
            placeholder="例: 3"
            {...register("time", {
              required: "時間の入力は必須です。",
              min: {
                value: 0,
                message: "時間は0以上である必要があります。",
              },
              max: {
                value: 24,
                message: "時間は24以下である必要があります。",
              },
            })}
          />
          {errors.time && (
            <Field.ErrorText>{errors.time.message}</Field.ErrorText>
          )}
          <Field.HelperText>0〜24時間の間で入力してください</Field.HelperText>
        </Field.Root>
        {/* プレビュー表示 */}
        <Field.Root>
          <Field.Label>入力内容の確認</Field.Label>
          <Stack
            gap="2"
            p="4"
            bg="gray.50"
            rounded="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" color="gray.600">
              学習内容:
              <Text as="span" fontWeight="medium" color="gray.900" ml="2">
                {watchedValues.title || "未入力"}
              </Text>
            </Text>
            <Text fontSize="sm" color="gray.600">
              学習時間:
              <Text as="span" fontWeight="medium" color="gray.900" ml="2">
                {watchedValues.time || 0}時間
              </Text>
            </Text>
          </Stack>
        </Field.Root>

        <VStack justify={"end"} gap={"3"}>
          <Button
            type="button"
            colorPalette="green"
            size="lg"
            width="full"
            onClick={onCancel}
          >
            キャンセル
          </Button>

          {/* 送信ボタン */}
          <Button
            type="submit"
            colorPalette="blue"
            size="lg"
            width="full"
            loading={isSubmitting || isLoading}
            loadingText={mode === "edit" ? "更新中..." : "登録中..."}
          >
            {mode === "edit" ? "更新" : "登録"}
          </Button>
        </VStack>
      </Stack>
    </form>
  );
}
