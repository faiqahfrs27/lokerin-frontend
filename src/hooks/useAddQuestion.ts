import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  createQuestionSchema,
  type CreateQuestionValues,
} from "../schemas/testSchemas";

export function useAddQuestion(testId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateQuestionValues>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      questionText: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateQuestionValues) => {
      const res = await axiosInstance.post(`/tests/${testId}/questions`, {
        questionText: payload.questionText,
        options: payload.options.filter((o) => o.trim() !== ""),
        correctIndex: payload.correctIndex,
        order: payload.order,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test", testId] });
      toast.success("Question added");
      form.reset({
        questionText: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      });
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to add question");
    },
  });

  const onSubmit = async (data: CreateQuestionValues) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}