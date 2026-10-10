import {
  test as base,
  expect,
  APIRequestContext,
  APIResponse,
} from "@playwright/test";
import { CustomersQuery } from "../schemas/customers-query.schema";
import {
  CustomersResponse,
  CustomersResponseSchema,
} from "../schemas/customers-response.schema";
import { expectValidSchema } from "../utils/validate-schema";

export class CustomersApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Typed: for the happy path. Skips undefined keys (avoids ?size=undefined). */
  async list(query: CustomersQuery = {}): Promise<APIResponse> {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== undefined),
    ) as Record<string, string | number>;
    return this.request.get("/customers", { params });
  }

  /** Raw: accepts any value, including ones the typing forbids (negative scenarios). */
  async listRaw(
    params: Record<string, string | number> = {},
  ): Promise<APIResponse> {
    return this.request.get("/customers", { params });
  }

  /** Shortcut: validates 200 + full contract and returns the typed body. */
  async listOk(query: CustomersQuery = {}): Promise<CustomersResponse> {
    const response = await this.list(query);
    expect(response.status(), `Query: ${JSON.stringify(query)}`).toBe(200);
    return expectValidSchema(CustomersResponseSchema, await response.json());
  }
}

export const test = base.extend<{ customersApi: CustomersApi }>({
  customersApi: async ({ request }, use) => {
    await use(new CustomersApi(request));
  },
});

export { expect };
