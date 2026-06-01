import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../lib/axios";
import type { ForgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";

export function useForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ForgotPasswordSchema) => {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email: payload.email,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Backend selalu return success — error ini hanya untuk network issue
      console.error("Forgot password error:", error);
      setIsSubmitted(true);
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending, isSubmitted };
}