import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type AnalyticsOverview = {
  summary: {
    totalJobs: number;
    totalApplicants: number;
    acceptedCount: number;
    interviewsCount: number;
  };
  genderDistribution: { gender: string; count: number }[];
  ageDistribution: { ageGroup: string; count: number }[];
  educationDistribution: { education: string; count: number }[];
  applicantsByCategory: { category: string; count: number }[];
  avgSalaryByCategory: { category: string; avgExpectedSalary: number }[];
  topCities: { city: string; count: number }[];
};

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const res = await axiosInstance.get<AnalyticsOverview>(
        "/analytics/overview",
      );
      return res.data;
    },
  });
}