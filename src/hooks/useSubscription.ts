import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type { Payment, MySubscription } from "../schemas/subscriptionSchema";
import type { Subscriber, SubscriberStats } from "../schemas/subscriberSchema";

const PAYMENTS_KEY = ["payments"];

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    if (message) return message;
  }
  return fallback;
}

export function usePayments(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...PAYMENTS_KEY, page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get<{
        data: Payment[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>("/subscriptions/payments", { params: { page, limit } });
      return res.data;
    },
  });
}

export function useApprovePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/subscriptions/payments/${id}/approve`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYMENTS_KEY });
      toast.success("Payment approved");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to approve payment")),
  });
}

export function useRejectPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/subscriptions/payments/${id}/reject`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYMENTS_KEY });
      toast.success("Payment rejected");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to reject payment")),
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ["my-subscription"],
    queryFn: async () => {
      const res = await axiosInstance.get<MySubscription | null>(
        "/subscriptions/me",
      );
      return res.data;
    },
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { planId: string; proof: File }) => {
      const form = new FormData();
      form.append("planId", vars.planId);
      form.append("proof", vars.proof);
      const res = await axiosInstance.post("/subscriptions/subscribe", form);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
      toast.success("Payment submitted! Waiting for approval.");
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to submit payment")),
  });
}

export function useCreateXenditInvoice() {
  return useMutation({
    mutationFn: async (planId: string) => {
      const res = await axiosInstance.post<{ invoiceUrl: string }>(
        "/xendit/invoice",
        { planId },
      );
      return res.data;
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to create payment invoice")),
  });
}

export function useSubscribers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["subscribers", page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get<{
        data: Subscriber[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>("/subscriptions/subscribers", { params: { page, limit } });
      return res.data;
    },
  });
}

export function useSubscriberStats() {
  return useQuery({
    queryKey: ["subscriber-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get<SubscriberStats>(
        "/subscriptions/subscribers/stats",
      );
      return res.data;
    },
  });
}
