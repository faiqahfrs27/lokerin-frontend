import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

interface StartAttemptResponse {
  attemptId: string;
  attemptedAt: string;
  durationMinutes: number;
}

export function useStartAttempt(jobId: string | undefined) {
  return useQuery<StartAttemptResponse>({
    queryKey: ["test-start-attempt", jobId],
    queryFn: async () => {
      const res = await axiosInstance.post(`/tests/jobs/${jobId}/start`);
      return res.data;
    },
    enabled: !!jobId,
    staleTime: Infinity,
    retry: false,
  });
}