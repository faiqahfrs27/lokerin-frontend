import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { uploadToCloudinary } from "../lib/cloudinary";
import type { CreateJobValues } from "../schemas/createJobSchema";

export function useUpdateJob(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: {
      data: CreateJobValues;
      bannerFile?: File | null;
    }) => {
      const { data, bannerFile } = payload;
      const toastId = toast.loading(
        bannerFile ? "Uploading banner..." : "Updating job...",
      );

      try {
        let bannerUrl: string | undefined;
        if (bannerFile) {
          bannerUrl = await uploadToCloudinary(bannerFile);
          toast.loading("Updating job...", { id: toastId });
        }

        const res = await axiosInstance.patch(`/jobs/${id}`, {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          city: data.city,
          deadline: new Date(data.deadline).toISOString(),
          salary: data.salary ? Number(data.salary) : undefined,
          tags: data.tags
            ? data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          hasTest: data.hasTest,
          ...(bannerUrl && { bannerUrl }),
        });

        toast.dismiss(toastId);
        return res.data;
      } catch (error) {
        toast.dismiss(toastId);
        console.error("Upload/Update job failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job updated successfully");
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal update lowongan");
    },
  });

  return { update: mutateAsync, isPending };
}
