import { z } from "zod";

export const createTestSchema = z.object({
  jobId: z.string().uuid("Pick a job"),
  title: z.string().min(3, "Title min 3 characters"),
  description: z.string().optional(),
  allowRetake: z.boolean(),
  passingScore: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 0 && n <= 100;
      },
      { message: "Must be 0-100" },
    ),
  durationMinutes: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 1 && n <= 180;
      },
      { message: "Must be 1-180" },
    ),
});

export type CreateTestValues = z.infer<typeof createTestSchema>;

export const createQuestionSchema = z.object({
  questionText: z.string().min(3, "Question text required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "Minimum 2 options")
    .max(6, "Max 6 options"),
  correctIndex: z.number().int().min(0),
  order: z.number().int().min(0).optional(),
});

export type CreateQuestionValues = z.infer<typeof createQuestionSchema>;