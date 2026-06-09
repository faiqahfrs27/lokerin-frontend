import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export interface ApplicationJob {
  id: string;
  title: string;
  city: string | null;
  deadline: string | null;
  company: { id: string; name: string };
}

export interface Application {
  id: string;
  jobId: string;
  cvUrl: string;
  expectedSalary: number | string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
  rejectionReason: string | null;
  job: ApplicationJob;
}

export interface ApplicationsResponse {
  data: Application[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface Params {
  page?: number;
  limit?: number;
  status?: string;
}

export function useMyApplications(params: Params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);

  return useQuery<ApplicationsResponse>({
    queryKey: ["my-applications", params],
    queryFn: async () => {
      const res = await axiosInstance.get(`/applications?${query}`);
      return res.data;
    },
  });
}