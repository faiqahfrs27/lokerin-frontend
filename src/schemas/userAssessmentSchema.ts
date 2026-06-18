import { z } from "zod";

export const publishedQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  options: z.array(z.string()),
});

export const publishedAssessmentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  skillCategory: z.string(),
  passingScore: z.number().int(),
  durationMin: z.number().int(),
  badgePhoto: z.string().nullable().optional(),
  questions: z.array(publishedQuestionSchema).optional(),
});

export const resultQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number().int(),
});

export const resultAssessmentSchema = publishedAssessmentSchema.extend({
  questions: z.array(resultQuestionSchema).optional(),
});

export const attemptStartSchema = z.object({
  resultId: z.string().uuid(),
  startedAt: z.string(),
  durationMin: z.number().int(),
  assessment: publishedAssessmentSchema,
  questions: z.array(publishedQuestionSchema),
});

export const assessmentResultSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  assessmentId: z.string().uuid(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  answers: z.record(z.string(), z.number()).nullable(),
  score: z.number().int().nullable(),
  passed: z.boolean(),
  assessment: resultAssessmentSchema.optional(),
  badgeEarned: z
    .object({
      id: z.string().uuid(),
      earnedAt: z.string(),
    })
    .nullable()
    .optional(),
  certificate: z
    .object({
      id: z.string().uuid(),
      code: z.string(),
      issuedAt: z.string(),
    })
    .nullable()
    .optional(),
});

export const submitAnswersSchema = z.object({
  answers: z.record(z.string().uuid(), z.number().int().nonnegative()),
});

export type PublishedAssessment = z.infer<typeof publishedAssessmentSchema>;
export type PublishedQuestion = z.infer<typeof publishedQuestionSchema>;
export type AttemptStart = z.infer<typeof attemptStartSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;
export type SubmitAnswersPayload = z.infer<typeof submitAnswersSchema>;
export type ResultQuestion = z.infer<typeof resultQuestionSchema>;
