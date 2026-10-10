import { z } from "zod";

export const PageInfoSchema = z.object({
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(), // 0 when the filter returns nothing
  totalCustomers: z.number().int().nonnegative(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;
