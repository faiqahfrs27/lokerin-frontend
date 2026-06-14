import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  updateInterviewSchema,
  type UpdateInterviewValues,
} from "../schemas/interviewSchema";
import type { Interview } from "./useInterviews";

export function useUpdateInterview(
  interview: Interview,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateInterviewValues>({
    resolver: zodResolver(updateInterviewSchema),
    defaultValues: {
      scheduledAt: interview.scheduledAt.slice(0, 16),
      location: interview.location ?? "",
      notes: interview.notes ?? "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: UpdateInterviewValues) => {
      const res = await axiosInstance.patch(`/interviews/${interview.id}`, {
        scheduledAt: new Date(payload.scheduledAt).toISOString(),
        location: payload.location || null,
        notes: payload.notes || null,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-interviews"] });
      toast.success("Interview rescheduled ✨");
      onSuccess?.();
    },
    onError: (e: AxiosError<{ message: string }>) => {
      toast.error(e.response?.data?.message ?? "Failed to reschedule");
    },
  });

  const onSubmit = async (data: UpdateInterviewValues) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}