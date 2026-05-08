import { z } from "zod";

export const updateMeSchema = z.object({
  body: z.object({
    weightKg: z.number().min(20).max(500).nullable().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Senha atual é obrigatória"),
      newPassword: z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(100, "Senha muito longa")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve ter maiúscula, minúscula e número"),
      confirmNewPassword: z.string().min(1, "Confirmação da senha é obrigatória"),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, {
      message: "Senhas não conferem",
      path: ["confirmNewPassword"],
    }),
});