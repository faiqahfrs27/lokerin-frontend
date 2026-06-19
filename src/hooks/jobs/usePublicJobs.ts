// src/hooks/usePublicJobs.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { JobsResponse } from "../../types/job.types";

interface UsePublicJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  category?: string;
  categoryId?: string;
  companyId?: string;
  excludeJobId?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function usePublicJobs(params: UsePublicJobsParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.city) query.set("city", params.city);
  if (params.category) query.set("category", params.category);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.companyId) query.set("companyId", params.companyId);
  if (params.excludeJobId) query.set("excludeJobId", params.excludeJobId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);

  return useQuery<JobsResponse>({
    queryKey: ["public-jobs", params],
    queryFn: async () => {
      const res = await axiosInstance.get(`/jobs/public?${query}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
}