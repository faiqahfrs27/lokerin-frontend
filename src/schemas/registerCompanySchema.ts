import z from "zod";

export const registerCompanySchema = z
  .object({
    name: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor telepon tidak valid"),
    city: z.string().min(2, "Kota minimal 2 karakter").optional().or(z.literal("")),
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

export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>;