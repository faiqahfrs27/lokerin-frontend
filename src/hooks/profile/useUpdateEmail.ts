import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../stores/useAuth";

const updateEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type UpdateEmailSchema = z.infer<typeof updateEmailSchema>;

export function useUpdateEmail() {
  const logout = useAuth((s) => s.logout);

  const form = useForm<UpdateEmailSchema>({
    resolver: zodResolver(updateEmailSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: UpdateEmailSchema) => {
      const res = await axiosInstance.patch("/auth/profile/email", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Email updated! Please verify your new email then login again.");
      setTimeout(() => logout(), 2000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update email.");
    },
  });

  const onSubmit = async (data: UpdateEmailSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}