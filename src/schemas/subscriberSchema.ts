import { z } from "zod";

export const paymentHistoryItemSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  method: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const subscriberSchema = z.object({
  id: z.string().uuid(),
  user: z.object({
    fullName: z.string(),
    email: z.string(),
  }),
  plan: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.string(),
  paymentHistory: z.array(paymentHistoryItemSchema),
});

export const subscriberStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  standardCount: z.number(),
  professionalCount: z.number(),
});

export type Subscriber = z.infer<typeof subscriberSchema>;
export type SubscriberStats = z.infer<typeof subscriberStatsSchema>;
export type PaymentHistoryItem = z.infer<typeof paymentHistoryItemSchema>;