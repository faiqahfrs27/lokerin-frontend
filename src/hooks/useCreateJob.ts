import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
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

      // 1. Create job (JSON)
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
      });
      const createdJob = res.data;

      // 2. If banner file, upload it
      if (bannerFile && createdJob?.id) {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        const bannerRes = await axiosInstance.patch(
          `/jobs/${createdJob.id}/banner`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return bannerRes.data;
      }

      return createdJob;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job posted successfully 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal membuat lowongan");
    },
  });

  const onSubmit = async (data: CreateJobValues, bannerFile?: File | null) => {
    await mutateAsync({ data, bannerFile });
  };

  return { form, onSubmit, isPending };
}