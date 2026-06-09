import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

interface ApplyPayload {
  jobId: string;
  cvUrl: string;
  expectedSalary?: number;
  testAttemptId?: string;
}

export function useApply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApplyPayload) => {
      const res = await axiosInstance.post("/applications", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast.success("Application submitted!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to submit application.");
    },
  });
}