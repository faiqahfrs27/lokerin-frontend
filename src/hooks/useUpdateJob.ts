import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { CreateJobValues } from "../schemas/createJobSchema";

async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await axiosInstance.post("/cloudinary/sign");
  const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
  );
  return uploadRes.data.secure_url;
}

export function useUpdateJob(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: {
      data: CreateJobValues;
      bannerFile?: File | null;
    }) => {
      const { data, bannerFile } = payload;

      let bannerUrl: string | undefined;
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile);
      }

      const res = await axiosInstance.patch(`/jobs/${id}`, {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        city: data.city,
        deadline: new Date(data.deadline).toISOString(),
        salary: data.salary ? Number(data.salary) : undefined,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        hasTest: data.hasTest,
        ...(bannerUrl && { bannerUrl }),
      });
      return res.data;
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