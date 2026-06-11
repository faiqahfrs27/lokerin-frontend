import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type UserTestQuestion = {
  id: string;
  questionText: string;
  options: string[];
  order: number;
};

export type UserTest = {
  id: string;
  jobId: string;
  title: string;
  description: string | null;
  passingScore: number;
  durationMinutes: number;
  job: { id: string; title: string; isPublished: boolean };
  questions: UserTestQuestion[];
  myAttempt: {
    id: string;
    score: number;
    passed: boolean;
    attemptedAt: string;
  } | null;
};

export function useTestForJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ["test-for-job", jobId],
    queryFn: async () => {
      const res = await axiosInstance.get<UserTest>(`/tests/by-job/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
  });
}