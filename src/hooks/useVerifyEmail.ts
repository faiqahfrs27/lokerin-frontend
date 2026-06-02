import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export function useVerifyEmail(token: string) {
  const { isLoading, isSuccess, isError, error, data } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
     const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? "Verification failed. Please try again.";

  return { isLoading, isSuccess, isError, errorMessage, data };
}