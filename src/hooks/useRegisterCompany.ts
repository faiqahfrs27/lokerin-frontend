import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import type { RegisterCompanySchema } from "../schemas/registerCompanySchema";
import { registerCompanySchema } from "../schemas/registerCompanySchema";
import { useAuth } from "../stores/useAuth";

export function useRegisterCompany() {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();

  const form = useForm<RegisterCompanySchema>({
    resolver: zodResolver(registerCompanySchema),
    defaultValues: { agreeToTerms: false, phone: "", city: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: RegisterCompanySchema) => {
      const res = await axiosInstance.post("/auth/register", {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        city: payload.city || undefined,
        companyName: payload.name,
        password: payload.password,
        role: "admin",
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Akun perusahaan berhasil dibuat! Cek email untuk verifikasi. 📧");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Registrasi gagal, coba lagi.");
    },
  });

  const onSubmit = async (data: RegisterCompanySchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}