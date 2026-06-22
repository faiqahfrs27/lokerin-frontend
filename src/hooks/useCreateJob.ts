import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { uploadToCloudinary } from "../lib/cloudinary";
import {
  createJobSchema,
  type CreateJobValues,
} from "../schemas/createJobSchema";

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

      let bannerUrl: string | undefined;
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile);
      }

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