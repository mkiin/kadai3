import { useForm } from "react-hook-form";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { Stack, Field, Input, Button, Text } from "@chakra-ui/react";

type StudyRecord = Tables<"study_record">;
type InsetUpdateRecordType = TablesInsert<"study_record"> &
  TablesUpdate<"study_record">;

type StudyRecordFormProps = {
  onSubmit: (data: InsetUpdateRecordType) => Promise<void>;
  initialData?: StudyRecord;
  isLoading?: boolean;
};

export function StudyRecordForm({
  onSubmit,
  initialData,
  isLoading,
}: StudyRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<InsetUpdateRecordType>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          time: initialData.time,
        }
      : undefined,
  });

  // リアルタイムでフォーム値を監視
  const watchedValues = watch();

  const handleFormSubmit = async (data: InsetUpdateRecordType) => {
    await onSubmit(data);
    if (!initialData) {
      reset(); // 新規作成の場合のみフォームをリセット
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="6">
        {/* 学習内容入力 */}
        <Field.Root invalid={!!errors.title}>
          <Field.Label htmlFor="title">学習内容</Field.Label>
          <Input placeholder="例: React Hooks の学習" {...register("title")} />
          {errors.title && (
            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* 学習時間入力 */}
        <Field.Root invalid={!!errors.time}>
          <Field.Label htmlFor="time">学習時間（時間）</Field.Label>
          <Input placeholder="例: 3" {...register("time")} />
          {errors.time && (
            <Field.ErrorText>{errors.time.message}</Field.ErrorText>
          )}
          <Field.HelperText>0.1〜24時間の間で入力してください</Field.HelperText>
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

        {/* 送信ボタン */}
        <Button
          type="submit"
          colorPalette="blue"
          size="lg"
          width="full"
          loading={isSubmitting || isLoading}
          loadingText={initialData ? "更新中..." : "登録中..."}
        >
          {initialData ? "更新" : "登録"}
        </Button>
      </Stack>
    </form>
  );
}
