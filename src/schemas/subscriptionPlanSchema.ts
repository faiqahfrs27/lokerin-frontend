import { z } from "zod";

export const subscriptionPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  features: z.array(z.string()),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const planFormSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(50, "Plan name must be 50 characters or less"),
  price: z
    .number({ message: "Price must be a valid number" })
    .int("Price must be an integer")
    .positive("Price must be greater than 0"),
  features: z
    .array(z.object({ value: z.string().min(1, "Feature cannot be empty") }))
    .min(1, "Add at least one feature"),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type PlanFormValues = z.infer<typeof planFormSchema>;

export type PlanApiPayload = {
  name: string;
  price: number;
  features: string[];
};

export function toApiPayload(values: PlanFormValues): PlanApiPayload {
  return {
    name: values.name,
    price: values.price,
    features: values.features.map((f) => f.value),
  };
}