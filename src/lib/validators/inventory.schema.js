import { z } from "zod";

export const createInventorySchema = z.object({
  hospitalId: z.number().int(),
  bloodGroup: z.string(),
  units: z.number().int().min(1),
});

export const updateInventorySchema = z.object({
  bloodGroup: z.string().optional(),
  units: z.number().int().min(1).optional(),
});
