import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export interface ApplicationDetail {
  id: string;
  jobId: string;
  cvUrl: string;
  expectedSalary: number | string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
  rejectionReason: string | null;
  interview: {
    id: string;
    scheduledAt: string;
    location: string | null;
    notes: string | null;
  } | null;
  job: {
    id: string;
    title: string;
    city: string | null;
    deadline: string | null;
    description: string;
    company: { id: string; name: string; city: string | null };
  };
}

export function useApplicationDetail(id: string | undefined) {
  return useQuery<ApplicationDetail>({
    queryKey: ["application", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/applications/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
