import { z } from "zod";

export const updateMeSchema = z.object({
  body: z.object({
    weightKg: z.number().min(20).max(500).nullable().optional(),
  }),
});