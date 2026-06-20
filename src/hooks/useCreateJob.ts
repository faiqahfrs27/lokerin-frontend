import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  createJobSchema,
  type CreateJobValues,
} from "../schemas/createJobSchema";

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

export function useCreateJob(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      city: "",
      deadline: "",
      salary: "",
      tags: "",
      hasTest: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: {
      data: CreateJobValues;
      bannerFile?: File | null;
    }) => {
      const { data, bannerFile } = payload;

      // Upload banner directly to Cloudinary (kalo ada)
      let bannerUrl: string | undefined;
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile);
      }

      // Create job dengan bannerUrl include
      const res = await axiosInstance.post("/jobs", {
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
        bannerUrl,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job posted successfully 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal membuat lowongan");
    },
  });

  const onSubmit = async (data: CreateJobValues, bannerFile?: File | null) => {
    await mutateAsync({ data, bannerFile });
  };

  return { form, onSubmit, isPending };
}