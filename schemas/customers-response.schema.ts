import { z } from "zod";
import { CustomerSchema } from "./customer.schema";
import { PageInfoSchema } from "./pagination.schema";

export const CustomersResponseSchema = z
  .object({
    customers: z.array(CustomerSchema),
    pageInfo: PageInfoSchema,
  })
  .superRefine(({ customers, pageInfo }, ctx) => {
    // Cross-field invariants (rules a purely structural schema cannot capture)
    if (customers.length > pageInfo.totalCustomers) {
      ctx.addIssue({
        code: "custom",
        path: ["pageInfo", "totalCustomers"],
        message: `totalCustomers (${pageInfo.totalCustomers}) is lower than the number of returned items (${customers.length})`,
      });
    }

    // Only applies when there are items: page=999 and empty filters have currentPage > totalPages
    if (customers.length > 0 && pageInfo.currentPage > pageInfo.totalPages) {
      ctx.addIssue({
        code: "custom",
        path: ["pageInfo", "currentPage"],
        message: `currentPage (${pageInfo.currentPage}) is greater than totalPages (${pageInfo.totalPages}) while the response contains items`,
      });
    }

    if (pageInfo.totalCustomers === 0 && pageInfo.totalPages !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["pageInfo", "totalPages"],
        message: "totalPages must be 0 when totalCustomers is 0",
      });
    }
  });

export type CustomersResponse = z.infer<typeof CustomersResponseSchema>;
