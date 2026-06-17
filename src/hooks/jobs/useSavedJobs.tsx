import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import type { Job } from "../../types/job.types";

export interface SavedJob {
  id: string;
  jobId: string;
  createdAt: string;
  job: Job;
}

export function useSavedJobs() {
  return useQuery<SavedJob[]>({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/saved-jobs");
      return res.data;
    },
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await axiosInstance.post("/saved-jobs", { jobId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Job saved!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to save job.");
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await axiosInstance.delete(`/saved-jobs/${jobId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Job removed from saved.");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to remove job.");
    },
  });
}