import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type { CvFormData } from "../schemas/cvSchema";

const CV_KEY = ["cv"];

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    if (message) return message;
  }
  return fallback;
}

export function useGetCv() {
  return useQuery({
    queryKey: CV_KEY,
    queryFn: async () => {
      const res = await axiosInstance.get<CvFormData>("/cv");
      return res.data;
    },
  });
}

export function useSaveCv() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CvFormData) => {
      const res = await axiosInstance.post("/cv", body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CV_KEY });
      toast.success("CV saved successfully");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to save CV")),
  });
}

export function useDownloadCv() {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get("/cv/download", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lokerin-cv.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => toast.success("CV downloaded!"),
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to download CV")),
  });
}