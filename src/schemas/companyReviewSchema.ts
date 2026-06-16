import { z } from "zod";

export const createReviewSchema = z.object({
  position: z.string().min(1, "Position is required"),
  salaryEstimate: z.number().int().positive().optional(),
  content: z.string().min(10, "Review must be at least 10 characters"),
  cultureRating: z.number().int().min(1).max(5),
  worklifeRating: z.number().int().min(1).max(5),
  facilityRating: z.number().int().min(1).max(5),
  careerRating: z.number().int().min(1).max(5),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  position: z.string(),
  salaryEstimate: z.number().nullable(),
  content: z.string(),
  cultureRating: z.number(),
  worklifeRating: z.number(),
  facilityRating: z.number(),
  careerRating: z.number(),
  overallRating: z.number(),
  createdAt: z.string(),
});

export type CreateReviewData = z.infer<typeof createReviewSchema>;
export type CompanyReview = z.infer<typeof reviewSchema>;