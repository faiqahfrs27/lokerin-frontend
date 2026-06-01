import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { AssessmentDetail } from "../schemas/assessmentSchema";
import {
  createQuestionSchema,
  type CreateQuestionInput,
} from "../schemas/createQuestionSchema";

// Fetch detail assessment
export function useAssessmentDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: async () => {
      const res = await axiosInstance.get<AssessmentDetail>(`/assessments/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

// Tambah soal
export function useAddQuestion(assessmentId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: { question: "", options: ["", "", "", ""], correctIndex: 0 },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateQuestionInput) => {
      const res = await axiosInstance.post(`/assessments/${assessmentId}/questions`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Soal ditambahkan 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal menambah soal");
    },
  });

  const onSubmit = async (data: CreateQuestionInput) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}

// Hapus soal
export function useDeleteQuestion(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      await axiosInstance.delete(`/assessments/${assessmentId}/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Soal dihapus");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal hapus soal");
    },
  });
}

// Terbitkan assessment
export function usePublishAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.patch(`/assessments/${assessmentId}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Assessment diterbitkan 🚀");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal menerbitkan");
    },
  });
}

// Edit soal (update)
export function useUpdateQuestion(
  assessmentId: string,
  questionId: string,
  defaultValues: CreateQuestionInput,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  const form = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateQuestionInput) => {
      const res = await axiosInstance.patch(
        `/assessments/${assessmentId}/questions/${questionId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      toast.success("Soal diperbarui ✏️");
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal memperbarui soal");
    },
  });

  const onSubmit = async (data: CreateQuestionInput) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}