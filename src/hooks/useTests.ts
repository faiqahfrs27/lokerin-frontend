import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type TestListItem = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  durationMinutes: number;
  createdAt: string;
  job: { id: string; title: string };
  _count: { questions: number; attempts: number };
};

export type TestsResponse = {
  data: TestListItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

interface UseTestsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useTests(params: UseTestsParams = {}) {
  return useQuery({
    queryKey: ["tests", params],
    queryFn: async () => {
      const res = await axiosInstance.get<TestsResponse>("/tests", {
        params: { limit: 20, ...params },
      });
      return res.data;
    },
  });
}