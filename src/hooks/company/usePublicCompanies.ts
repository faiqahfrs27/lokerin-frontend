import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { CompaniesResponse } from "../../types/company.types";

interface UsePublicCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function usePublicCompanies(params: UsePublicCompaniesParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.city) query.set("city", params.city);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  return useQuery<CompaniesResponse>({
    queryKey: ["public-companies", params],
    queryFn: async () => {
      const res = await axiosInstance.get(`/companies?${query}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
}