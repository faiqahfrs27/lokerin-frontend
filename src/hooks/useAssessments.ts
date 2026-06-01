import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { Assessment } from "../schemas/assessmentSchema";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const res = await axiosInstance.get<Assessment[]>("/assessments");
      return res.data;
    },
  });
}