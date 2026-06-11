import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { CompanyDetail } from "../../types/company.types";

export function usePublicCompanyDetail(id: string | undefined) {
  return useQuery<CompanyDetail>({
    queryKey: ["company", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/companies/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}