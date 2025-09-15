import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudyRecord,
  deleteStudyRecord,
  getLatestStudyRecords,
  updateStudyRecord,
} from "@/api/study-record-query";
import type { TablesUpdate } from "@/types/database.types";

export const useCreateStudyrecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudyRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["study-records"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateStudyrecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"study_record">;
    }) => updateStudyRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["study-records"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteStudyrecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudyRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-records"] });
    },
    onError: (error) => {
      console.error("Failed to update study record:", error);
    },
  });
};

export const useGetLatestStudyRecord = (limit: number = 5) => {
  return useQuery({
    queryKey: ["study-records", "latest", limit],
    queryFn: () => getLatestStudyRecords(limit),
  });
};
