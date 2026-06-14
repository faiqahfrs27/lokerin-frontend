import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export type MyInterview = {
  id: string;
  scheduledAt: string;
  location: string | null;
  notes: string | null;
  application: {
    id: string;
    status: string;
    job: {
      id: string;
      title: string;
      city: string | null;
      company: {
        id: string;
        name: string;
        logoUrl: string | null;
      };
    };
  };
};

export function useMyInterviews() {
  return useQuery<{ data: MyInterview[] }>({
    queryKey: ["my-interviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/interviews/me");
      return res.data;
    },
  });
}