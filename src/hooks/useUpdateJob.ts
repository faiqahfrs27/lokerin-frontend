import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { CreateJobValues } from "../schemas/createJobSchema";

export function useUpdateJob(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateJobValues) => {
      const res = await axiosInstance.patch(`/jobs/${id}`, {
        title: payload.title,
        description: payload.description,
        categoryId: payload.categoryId,
        city: payload.city,
        deadline: new Date(payload.deadline).toISOString(),
        salary: payload.salary ? Number(payload.salary) : undefined,
        tags: payload.tags
          ? payload.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        bannerUrl: payload.bannerUrl || undefined,
        hasTest: payload.hasTest,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job updated successfully");
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal update lowongan");
    },
  });

  return { update: mutateAsync, isPending };
}