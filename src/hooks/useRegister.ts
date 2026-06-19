import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import type { RegisterSchema } from "../schemas/registerSchema";
import { registerSchema } from "../schemas/registerSchema";
import { useAuth } from "../stores/useAuth";

export function useRegister() {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: RegisterSchema) => {
      const res = await axiosInstance.post("/auth/register", {
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        role: "user",
      });
      console.log("payload yang dikirim:", res);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Registrasi berhasil! Cek email untuk verifikasi. 📧");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Registrasi gagal, coba lagi.");
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}