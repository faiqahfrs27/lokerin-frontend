import z from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  skillCategory: z.string().min(2, "Category is required"),
  passingScore: z
    .string()
    .min(1, "Passing score is required")
    .refine((v) => Number(v) >= 1 && Number(v) <= 100, "Must be 1-100"),
  durationMin: z
    .string()
    .min(1, "Duration is required")
    .refine((v) => Number(v) >= 1, "Minimum 1 minute"),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;