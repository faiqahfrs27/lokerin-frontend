import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type ApplicantStatus = "pending" | "reviewed" | "accepted" | "rejected";

export type Applicant = {
  id: string;
  status: ApplicantStatus;
  rejectionReason: string | null;
  expectedSalary: number | null;
  cvUrl: string;
  appliedAt: string;
  user: {
    id: string;
    email: string;
    profile?: {
      fullName: string | null;
      education: string | null;
      photoUrl: string | null;
      birthDate: string | null;
      gender: string | null;
      address: string | null;
    } | null;
  };
  job: { id: string; title: string; hasTest: boolean; city?: string | null };
  testAttempt: {
    id: string;
    score: number;
    passed: boolean;
    attemptedAt: string;
    test: { passingScore: number };
  } | null;
  interview?: {
    id: string;
    scheduledAt: string;
    location: string | null;
    notes: string | null;
  } | null;
};

export type ApplicantsResponse = {
  data: Applicant[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

interface UseApplicantsParams {
  page?: number;
  limit?: number;
  jobId?: string;
  status?: ApplicantStatus;
  search?: string;
  education?: string;
  minAge?: number;
  maxAge?: number;
  minSalary?: number;
  maxSalary?: number;
}

export function useApplicants(params: UseApplicantsParams = {}) {
  return useQuery({
    queryKey: ["applicants", params],
    queryFn: async () => {
      const res = await axiosInstance.get<ApplicantsResponse>("/applicants", {
        params: { limit: 20, ...params },
      });
      return res.data;
    },
  });
}
