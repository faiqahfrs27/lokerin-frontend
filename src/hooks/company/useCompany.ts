import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  descriptionRte: string | null;
  logoUrl: string | null;
}

export function useCompany() {
  return useQuery<Company>({
    queryKey: ["company-me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/companies/me");
      return res.data;
    },
  });
}