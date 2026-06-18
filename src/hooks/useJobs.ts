import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type Job = {
  id: string;
  title: string;
  description: string;
  city: string;
  isPublished: boolean;
  salary: number | null;
  deadline: string;
  createdAt: string;
  hasTest: boolean;
  tags: unknown;
  bannerUrl: string | null;
  category?: { id: string; name: string } | null;
  _count?: { applications: number };
};

export type JobsResponse = {
  data: Job[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

interface UseJobsParams {
  page?: number;
  limit?: number;
  isPublished?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  categoryId?: string;
}

export function useJobs(params: UseJobsParams = {}) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: async () => {
      const res = await axiosInstance.get<JobsResponse>("/jobs", {
        params: { limit: 20, ...params },
      });
      return res.data;
    },
  });
}
