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
      bannerUrl: "",
      hasTest: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateJobValues) => {
      const res = await axiosInstance.post("/jobs", {
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
      toast.success("Job posted successfully 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal membuat lowongan");
    },
  });

  const onSubmit = async (data: CreateJobValues) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}