import z from "zod";

export const createQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Must have exactly 4 options"),
  correctIndex: z.number().min(0).max(3),
});

export const updateQuestionSchema = createQuestionSchema;

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;