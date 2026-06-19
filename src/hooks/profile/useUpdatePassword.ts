import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export function useUpdatePassword() {
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: UpdatePasswordSchema) => {
      const res = await axiosInstance.patch("/auth/profile/password", {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated!");
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update password.");
    },
  });

  const onSubmit = async (data: UpdatePasswordSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}