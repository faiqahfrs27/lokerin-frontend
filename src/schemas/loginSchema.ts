import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(1, "Need to fill in password"),
});

export type LoginSchema = z.infer<typeof loginSchema>;