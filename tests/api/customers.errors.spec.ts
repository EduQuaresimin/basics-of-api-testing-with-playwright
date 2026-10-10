import { test, expect } from "../../fixtures/api.fixture";

type Case = { name: string; params: Record<string, string | number> };

const invalidCases: Case[] = [
  { name: "page=0", params: { page: 0 } },
  { name: "negative page", params: { page: -1 } },
  { name: "non-numeric page", params: { page: "abc" } },
  { name: "empty page", params: { page: "" } },
  { name: "limit=0", params: { limit: 0 } },
  { name: "negative limit", params: { limit: -5 } },
  { name: "non-numeric limit", params: { limit: "abc" } },
  { name: "empty limit", params: { limit: "" } },
  { name: "unsupported size", params: { size: "Gigante" } },
  { name: "lowercase size (case-sensitive)", params: { size: "small" } },
  { name: "unsupported industry", params: { industry: "Agro" } },
  {
    name: "lowercase industry (case-sensitive)",
    params: { industry: "retail" },
  },
];

test.describe("GET /customers: invalid parameters", () => {
  for (const { name, params } of invalidCases) {
    test(`${name} returns 400`, async ({ customersApi }) => {
      const response = await customersApi.listRaw(params);

      expect(response.status(), `Body: ${await response.text()}`).toBe(400);
    });
  }

  test("one invalid parameter fails the whole request even if the others are valid", async ({
    customersApi,
  }) => {
    const response = await customersApi.listRaw({
      page: 1,
      limit: 10,
      size: "Gigante",
    });

    expect(response.status()).toBe(400);
  });

  // KNOWN BUG: the API accepts a decimal page and applies a fractional offset
  // (page=1.5 returns customers 5 to 15). Expected: 400.
  // test.fail() keeps the suite green today and starts failing once the bug is fixed,
  // signaling that this annotation must be removed.
  test("decimal page should return 400", async ({ customersApi }) => {
    test.fail(true, "Known bug: page=1.5 is accepted with a fractional offset");

    const response = await customersApi.listRaw({ page: 1.5 });

    expect(response.status()).toBe(400);
  });
});
