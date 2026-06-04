import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { Job } from "./useJobs";

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ["jobs", "detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<Job>(`/jobs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}