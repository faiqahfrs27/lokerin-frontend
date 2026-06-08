import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../stores/useAuth";

interface UpdateProfilePayload {
  fullName?: string;
  birthDate?: string;
  gender?: "male" | "female";
  education?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const login = useAuth((s) => s.login);
  const user = useAuth((s) => s.user);

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await axiosInstance.patch("/auth/profile", payload);
      return res.data;
    },
    onSuccess: (data) => {
      // Update Zustand store
      if (user) {
        login({ ...user, profile: data });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update profile.");
    },
  });
}