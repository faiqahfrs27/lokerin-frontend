import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export type AttemptResult = {
  attemptId: string;
  score: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctAnswers: number;
};

export type SubmitPayload = {
  answers: { questionId: string; selectedIndex: number }[];
};

export function useSubmitAttempt(testId: string) {
  return useMutation({
    mutationFn: async (payload: SubmitPayload) => {
      const res = await axiosInstance.post<AttemptResult>(
        `/tests/${testId}/attempt`,
        payload,
      );
      return res.data;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to submit");
    },
  });
}