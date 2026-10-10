import { expect } from "@playwright/test";
import { z } from "zod";

export function expectValidSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);

  expect(
    result.success,
    `Invalid contract:\n${JSON.stringify(result.error?.issues, null, 2)}`,
  ).toBe(true);

  return result.data as z.infer<T>;
}
