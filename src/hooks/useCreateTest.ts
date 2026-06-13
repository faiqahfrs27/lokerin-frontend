import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  createTestSchema,
  type CreateTestValues,
} from "../schemas/testSchemas";

export function useCreateTest(onSuccess?: (id: string) => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateTestValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      jobId: "",
      title: "",
      description: "",
      passingScore: "75",
      durationMinutes: "30",
      allowRetake: true,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateTestValues) => {
      const res = await axiosInstance.post("/tests", {
        jobId: payload.jobId,
        title: payload.title,
        description: payload.description || undefined,
        passingScore: Number(payload.passingScore),
        durationMinutes: Number(payload.durationMinutes),
        allowRetake: payload.allowRetake,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Test created 🎉");
      form.reset();
      onSuccess?.(data.id);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to create test");
    },
  });

  const onSubmit = async (data: CreateTestValues) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}