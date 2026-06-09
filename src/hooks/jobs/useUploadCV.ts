import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export function useUploadCv() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("cv", file);
      const res = await axiosInstance.patch("/auth/profile/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as { cvUrl: string };
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to upload CV.");
    },
  });
}