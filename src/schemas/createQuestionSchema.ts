import z from "zod";

export const createQuestionSchema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  options: z
    .array(z.string().min(1, "Opsi tidak boleh kosong"))
    .length(4, "Harus tepat 4 opsi"),
  correctIndex: z.number().min(0).max(3),
});

export const updateQuestionSchema = createQuestionSchema;

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;