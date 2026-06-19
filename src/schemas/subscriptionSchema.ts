import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().int(),
  method: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  proofUrl: z.string().nullable(),
  createdAt: z.string(),
  user: z.object({
    email: z.string(),
    profile: z.object({ fullName: z.string() }).nullable(),
  }),
  subscription: z.object({
    plan: z.object({ name: z.string() }),
  }),
});

export type Payment = z.infer<typeof paymentSchema>;

export const mySubscriptionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "expired", "cancelled"]),
  startDate: z.string(),
  endDate: z.string(),
  plan: z.object({
    name: z.string(),
    price: z.number().int(),
    features: z.array(z.string()),
  }),
  payments: z.array(
    z.object({
      status: z.string(),
      proofUrl: z.string().nullable(),
      createdAt: z.string(),
    }),
  ),
});

export type MySubscription = z.infer<typeof mySubscriptionSchema>;