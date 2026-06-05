import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../stores/useAuth";

export function useGoogleAuth() {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (accessToken: string) => {
      const res = await axiosInstance.post("/auth/google", { accessToken });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Welcome! 👋");

      const from = (location.state as { from?: string })?.from;
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin/postings", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Google login failed.");
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await mutateAsync(tokenResponse.access_token);
    },
    onError: () => {
      toast.error("Google login cancelled or failed.");
    },
  });

  return { handleGoogleLogin, isPending };
}