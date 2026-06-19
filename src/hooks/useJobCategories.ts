import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type JobCategory = {
  id: string;
  name: string;
};

export type JobCategoriesResponse = {
  data: JobCategory[];
};

export function useJobCategories() {
  return useQuery({
    queryKey: ["job-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get<JobCategoriesResponse>(
        "/job-categories",
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — categories rarely change
  });
}