import { z } from "zod";

export const createRequestSchema = z.object({
  userId: z.number().int(),
  bloodGroup: z.string(),
  units: z.number().int().min(1),
});

export const updateRequestSchema = z.object({
  status: z.enum(["PENDING", "FULFILLED", "CANCELLED"]),
});
