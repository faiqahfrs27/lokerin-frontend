import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import type {
  CompanyReview,
  CreateReviewData,
} from "../../schemas/companyReviewSchema";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    if (message) return message;
  }
  return fallback;
}

// Get all reviews for a company (public, paginated)
export function useCompanyReviews(
  companyId: string | undefined,
  page = 1,
  limit = 10,
) {
  return useQuery({
    queryKey: ["company-reviews", companyId, page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get<{
        data: CompanyReview[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/company-reviews/${companyId}`, { params: { page, limit } });
      return res.data;
    },
    enabled: !!companyId,
  });
}

// Check if user is eligible to review
export function useReviewEligibility(companyId: string | undefined) {
  return useQuery({
    queryKey: ["review-eligibility", companyId],
    queryFn: async () => {
      const res = await axiosInstance.get<{ eligible: boolean }>(
        `/company-reviews/${companyId}/eligibility`,
      );
      return res.data;
    },
    enabled: !!companyId,
  });
}

// Check if user already reviewed
export function useMyCompanyReview(companyId: string | undefined) {
  return useQuery({
    queryKey: ["my-company-review", companyId],
    queryFn: async () => {
      const res = await axiosInstance.get<{ hasReviewed: boolean }>(
        `/company-reviews/${companyId}/me`,
      );
      return res.data;
    },
    enabled: !!companyId,
  });
}

// Submit a review
export function useCreateReview(companyId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateReviewData) => {
      const res = await axiosInstance.post(
        `/company-reviews/${companyId}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["company-reviews", companyId] });
      qc.invalidateQueries({ queryKey: ["my-company-review", companyId] });
      toast.success("Review submitted successfully!");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to submit review")),
  });
}
