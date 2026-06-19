import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { MyBadge } from "../../types/badge";

export function useMyBadges() {
  return useQuery({
    queryKey: ["my-badges"],
    queryFn: async () => {
      const res = await axiosInstance.get<MyBadge[]>("/badges/me");
      return res.data;
    },
  });
}