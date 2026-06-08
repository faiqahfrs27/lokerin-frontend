import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { VerifyResult } from "../../types/verify";

export function useVerifyCertificate(code?: string) {
  return useQuery({
    queryKey: ["verify-certificate", code],
    queryFn: async () => {
      const res = await axiosInstance.get<VerifyResult>(
        `/certificates/verify/${code}`,
      );
      return res.data;
    },
    enabled: !!code,
    retry: false,
  });
}