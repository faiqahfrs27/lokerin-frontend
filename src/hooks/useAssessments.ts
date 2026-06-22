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

export interface UsageData {
  unlockedAssessmentIds: string[];
  count: number;
  limit: number | null;
  canTake: boolean;
  reason: "ok" | "unlimited" | "no_subscription" | "limit_reached";
}

export function useAssessmentUsage() {
  return useQuery({
    queryKey: ["assessment-usage"],
    queryFn: async () => {
      const res = await axiosInstance.get<UsageData>(
        "/assessment-results/usage",
      );
      return res.data;
    },
  });
}