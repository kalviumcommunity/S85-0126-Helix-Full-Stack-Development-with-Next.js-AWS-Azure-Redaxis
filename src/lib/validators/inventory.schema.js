import { z } from "zod";

const optionalDate = z
  .preprocess((v) => {
    if (v === undefined || v === null || v === "") return undefined;
    const d = v instanceof Date ? v : new Date(String(v));
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, z.date())
  .optional();

export const createInventorySchema = z.object({
  hospitalId: z.number().int(),
  bloodGroup: z.string(),
  units: z.number().int().min(0),
  expiryDate: optionalDate,
});

export const updateInventorySchema = z.object({
  bloodGroup: z.string().optional(),
  units: z.number().int().min(0).optional(),
  expiryDate: optionalDate,
});
