import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type TestQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  order: number;
  createdAt: string;
};

export type TestDetail = {
  id: string;
  jobId: string;
  title: string;
  description: string | null;
  passingScore: number;
  durationMinutes: number;
  createdAt: string;
  job: { id: string; title: string };
  questions: TestQuestion[];
  _count: { attempts: number };
};

export function useTest(id: string | undefined) {
  return useQuery({
    queryKey: ["test", id],
    queryFn: async () => {
      const res = await axiosInstance.get<TestDetail>(`/tests/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}