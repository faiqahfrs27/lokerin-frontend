import z from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  skillCategory: z.string().min(2, "Kategori wajib diisi"),
  passingScore: z
    .string()
    .min(1, "Nilai lulus wajib diisi")
    .refine((v) => Number(v) >= 1 && Number(v) <= 100, "Harus 1-100"),
  durationMin: z
    .string()
    .min(1, "Durasi wajib diisi")
    .refine((v) => Number(v) >= 1, "Minimal 1 menit"),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;