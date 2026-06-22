import z from "zod";

export const assessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  skillCategory: z.string(),
  passingScore: z.number(),
  durationMin: z.number(),
  badgePhoto: z.string().nullable(),
  isPublished: z.boolean(),
  _count: z.object({
    questions: z.number(),
  }),
});

export const assessmentQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
});

export const assessmentDetailSchema = assessmentSchema.extend({
  questions: z.array(assessmentQuestionSchema),
});

export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>;
export type AssessmentDetail = z.infer<typeof assessmentDetailSchema>;