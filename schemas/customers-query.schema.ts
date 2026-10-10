import { z } from "zod";
import { CUSTOMER_SIZES, INDUSTRIES } from "./enums";

/** INTENDED contract for the query params (used to type the happy-path tests). */
export const CustomersQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  size: z.enum(CUSTOMER_SIZES).optional(),
  industry: z.enum(INDUSTRIES).optional(),
});

export type CustomersQuery = z.infer<typeof CustomersQuerySchema>;
