import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface CreateJobCategoryPayload {
  name: string;
}

interface JobCategoryCreated {
  id: string;
  name: string;
}

export function useCreateJobCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJobCategoryPayload) => {
      const res = await axiosInstance.post<JobCategoryCreated>(
        "/job-categories",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-categories"] });
      toast.success("Category added");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to add category");
    },
  });
}