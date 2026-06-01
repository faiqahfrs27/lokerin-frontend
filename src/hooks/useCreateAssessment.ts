import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  createAssessmentSchema,
  type CreateAssessmentInput,
} from "../schemas/createAssessmentSchema";

export function useCreateAssessment(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateAssessmentInput>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: { title: "", skillCategory: "", passingScore: "75", durationMin: "30" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateAssessmentInput) => {
      const res = await axiosInstance.post("/assessments", {
        title: payload.title,
        skillCategory: payload.skillCategory,
        passingScore: Number(payload.passingScore),
        durationMin: Number(payload.durationMin),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Assessment berhasil dibuat 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal membuat assessment");
    },
  });

  const onSubmit = async (data: CreateAssessmentInput) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}