import z from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf kapital")
      .regex(/[0-9]/, "Harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "Kamu harus menyetujui Syarat & Ketentuan"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;