import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { CompanyDetail } from "../../types/company.types";

interface Params {
  jobPage?: number;
  jobLimit?: number;
}

export function usePublicCompanyDetail(
  id: string | undefined,
  params: Params = {},
) {
  const query = new URLSearchParams();
  if (params.jobPage) query.set("jobPage", String(params.jobPage));
  if (params.jobLimit) query.set("jobLimit", String(params.jobLimit));

  return useQuery<CompanyDetail>({
    queryKey: ["company", id, params],
    queryFn: async () => {
      const res = await axiosInstance.get(`/companies/${id}?${query}`);
      return res.data;
    },
    enabled: !!id,
  });
}
