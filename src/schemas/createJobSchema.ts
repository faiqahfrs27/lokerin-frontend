import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .max(200, "Maximum 200 characters"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Please pick a category"),
  city: z.string().min(1, "City is required"),
  deadline: z.string().min(1, "Deadline is required"),
  salary: z.string().optional(),
  tags: z.string().optional(),
  bannerUrl: z.string().optional(),
  hasTest: z.boolean(),
});

export type CreateJobValues = z.infer<typeof createJobSchema>;