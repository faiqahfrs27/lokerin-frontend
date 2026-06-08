import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { UserAuth } from "../../stores/useAuth";

export function useProfile() {
  return useQuery<UserAuth>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/profile");
      return res.data;
    },
  });
}