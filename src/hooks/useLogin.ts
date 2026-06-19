import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";
import { axiosInstance } from "../lib/axios";
import type { LoginSchema } from "../schemas/loginSchema";
import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../stores/useAuth";

export function useLogin() {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: LoginSchema) => {
      const res = await axiosInstance.post("/auth/login", {
        email: payload.email,
        password: payload.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Welcome back! 👋");

      const from = (location.state as { from?: string })?.from;

      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin/postings", { replace: true });
      } else if (data.user.role === "dev") {
        navigate("/dev/assessments", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Login failed, please try again.");
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    await mutateAsync(data);
  };

  return { form, onSubmit, isPending };
}