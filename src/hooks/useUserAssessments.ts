import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type {
  AssessmentResult,
  AttemptStart,
  PublishedAssessment,
  SubmitAnswersPayload,
} from "../schemas/userAssessmentSchema";

const PUBLISHED_KEY = ["assessments", "published"];
const MY_RESULTS_KEY = ["assessment-results", "me"];
const RESULT_KEY = (id: string) => ["assessment-results", id];

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    if (msg) return msg;
  }
  return fallback;
}

export function usePublishedAssessments() {
  return useQuery({
    queryKey: PUBLISHED_KEY,
    queryFn: async () => {
      const res = await axiosInstance.get<PublishedAssessment[]>(
        "/assessments/published",
      );
      return res.data;
    },
  });
}

export function useMyResults() {
  return useQuery({
    queryKey: MY_RESULTS_KEY,
    queryFn: async () => {
      const res = await axiosInstance.get<AssessmentResult[]>(
        "/assessment-results/me",
      );
      return res.data;
    },
  });
}

export function useResultById(id: string | undefined) {
  return useQuery({
    queryKey: RESULT_KEY(id ?? ""),
    queryFn: async () => {
      const res = await axiosInstance.get<AssessmentResult>(
        `/assessment-results/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await axiosInstance.post<AttemptStart>(
        `/assessment-results/start/${assessmentId}`,
      );
      return res.data;
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to start assessment")),
  });
}

export function useSubmitAnswers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      attemptId: string;
      body: SubmitAnswersPayload;
    }) => {
      const res = await axiosInstance.post<AssessmentResult>(
        `/assessment-results/${vars.attemptId}/submit`,
        vars.body,
      );
      return res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: MY_RESULTS_KEY });
      qc.setQueryData(RESULT_KEY(data.id), data);
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to submit answers")),
  });
}