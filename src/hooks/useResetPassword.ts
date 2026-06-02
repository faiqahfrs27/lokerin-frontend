import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import type { ResetPasswordSchema } from "../schemas/resetPasswordSchema";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";

export function useResetPassword(token: string) {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ResetPasswordSchema) => {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        newPassword: payload.newPassword,
        confirmNewPassword: payload.confirmNewPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to reset password.");
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending, isSuccess };
}