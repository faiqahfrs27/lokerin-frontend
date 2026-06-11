import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional(),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  major: z.string().min(1, "Major is required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional(),
  gpa: z.string().optional(),
});

export const cvFormSchema = z.object({
  summary: z.string().optional(),
  phone: z.string().optional(),
  portfolioUrl: z.string().optional(),
  experiences: z.array(experienceSchema).default([]),
  educations: z.array(educationSchema).default([]),
  additionalSkills: z.array(z.string()).default([]),
});

export type CvFormData = z.infer<typeof cvFormSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;