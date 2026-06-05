import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { ApplicantStatus } from "./useApplicants";

type UpdateBody = {
  status: ApplicantStatus;
  rejectionReason?: string;
};

export function useUpdateApplicantStatus(applicationId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateBody) => {
      const res = await axiosInstance.patch(
        `/applicants/${applicationId}/status`,
        body,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      const labels: Record<string, string> = {
        reviewed: "Marked as reviewed",
        accepted: "Applicant accepted 🎉",
        rejected: "Applicant rejected",
      };
      toast.success(labels[variables.status] ?? "Status updated");
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal update status");
    },
  });
}