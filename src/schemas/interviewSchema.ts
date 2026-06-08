import { z } from "zod";

export const createInterviewSchema = z.object({
  applicationId: z.string().min(1, "Pick an applicant"),
  scheduledAt: z
    .string()
    .min(1, "Pick a date and time")
    .refine((val) => {
      const d = new Date(val);
      return d > new Date();
    }, "Schedule must be in the future"),
  location: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type CreateInterviewValues = z.infer<typeof createInterviewSchema>;