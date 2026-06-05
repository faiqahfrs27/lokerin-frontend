import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { Applicant } from "./useApplicants";

export function useApplicant(id: string | undefined) {
  return useQuery({
    queryKey: ["applicants", "detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<Applicant>(`/applicants/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}