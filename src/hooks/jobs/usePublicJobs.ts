// src/hooks/usePublicJobs.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { JobsResponse } from "../../types/job.types";

interface UsePublicJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function usePublicJobs(params: UsePublicJobsParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.city) query.set("city", params.city);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  return useQuery<JobsResponse>({
    queryKey: ["public-jobs", params],
    queryFn: async () => {
      const res = await axiosInstance.get(`/jobs/public?${query}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
}