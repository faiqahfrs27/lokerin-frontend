import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../stores/useAuth";

export function useUpdatePhoto() {
  const queryClient = useQueryClient();
  const login = useAuth((s) => s.login);
  const user = useAuth((s) => s.user);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await axiosInstance.patch("/auth/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (user) {
        login({ ...user, profile: { ...user.profile!, photoUrl: data.photoUrl } });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo updated!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to upload photo.");
    },
  });
}