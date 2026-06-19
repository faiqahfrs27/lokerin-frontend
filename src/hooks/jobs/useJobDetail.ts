import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { Job } from "../../types/job.types";

export function useJobDetail(id: string | undefined) {
  return useQuery<Job>({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/jobs/public/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}