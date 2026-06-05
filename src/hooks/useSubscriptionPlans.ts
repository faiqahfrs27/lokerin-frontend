import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type {
  PlanApiPayload,
  SubscriptionPlan,
} from "../schemas/subscriptionPlanSchema";

const PLANS_KEY = ["subscription-plans"];


// HELPERS
function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    if (message) return message;
  }
  return fallback;
}


// QUERIES
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: PLANS_KEY,
    queryFn: async () => {
      const res = await axiosInstance.get<SubscriptionPlan[]>(
        "/subscription-plans",
      );
      return res.data;
    },
  });
}


// MUTATIONS
export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PlanApiPayload) => {
      const res = await axiosInstance.post<SubscriptionPlan>(
        "/subscription-plans",
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Plan created");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to create plan")),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; body: PlanApiPayload }) => {
      const res = await axiosInstance.patch<SubscriptionPlan>(
        `/subscription-plans/${vars.id}`,
        vars.body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Plan updated");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to update plan")),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/subscription-plans/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Plan deleted");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to delete plan")),
  });
}