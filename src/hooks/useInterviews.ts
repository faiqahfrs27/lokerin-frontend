import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  createInterviewSchema,
  type CreateInterviewValues,
} from "../schemas/interviewSchema";

export type Interview = {
  id: string;
  scheduledAt: string;
  location: string | null;
  notes: string | null;
  reminderSent: boolean;
  createdAt: string;
  application: {
    id: string;
    user: {
      id: string;
      email: string;
      profile: {
        fullName: string | null;
        photoUrl: string | null;
      } | null;
    };
    job: { id: string; title: string };
  };
};

export type InterviewsResponse = {
  data: Interview[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: async () => {
      const res = await axiosInstance.get<InterviewsResponse>("/interviews", {
        params: { limit: 50 },
      });
      return res.data;
    },
  });
}

export function useCreateInterview(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<CreateInterviewValues>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      applicationId: "",
      scheduledAt: "",
      location: "",
      notes: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateInterviewValues) => {
      const res = await axiosInstance.post("/interviews", {
        applicationId: payload.applicationId,
        scheduledAt: new Date(payload.scheduledAt).toISOString(),
        location: payload.location || undefined,
        notes: payload.notes || undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      toast.success("Interview scheduled 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message ?? "Failed to schedule interview",
      );
    },
  });

  const onSubmit = async (data: CreateInterviewValues) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}

export function useDeleteInterview(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/interviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      toast.success("Interview cancelled");
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message ?? "Failed to cancel interview",
      );
    },
  });
}