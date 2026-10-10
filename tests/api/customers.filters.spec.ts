import { test, expect } from "../../fixtures/api.fixture";
import { CUSTOMER_SIZES, INDUSTRIES } from "../../schemas/enums";

test.describe("GET /customers: filters", () => {
  for (const size of CUSTOMER_SIZES) {
    test(`size=${size} returns only that company size`, async ({
      customersApi,
    }) => {
      const { customers } = await customersApi.listOk({ size, limit: 50 });

      expect(customers.length).toBeGreaterThan(0);
      for (const c of customers)
        expect.soft(c.size, `Customer ${c.id}`).toBe(size);
    });
  }

  for (const industry of INDUSTRIES) {
    test(`industry=${industry} returns only that industry`, async ({
      customersApi,
    }) => {
      const { customers } = await customersApi.listOk({ industry, limit: 50 });

      expect(customers.length).toBeGreaterThan(0);
      for (const c of customers)
        expect.soft(c.industry, `Customer ${c.id}`).toBe(industry);
    });
  }

  test("combined filters apply AND logic", async ({ customersApi }) => {
    const { customers } = await customersApi.listOk({
      size: "Medium",
      industry: "Retail",
      limit: 50,
    });

    for (const c of customers) {
      expect.soft(c.size, `Customer ${c.id}`).toBe("Medium");
      expect.soft(c.industry, `Customer ${c.id}`).toBe("Retail");
    }
  });

  test("sum of totals per size equals the unfiltered total", async ({
    customersApi,
  }) => {
    const all = await customersApi.listOk();
    const totals = await Promise.all(
      CUSTOMER_SIZES.map(
        async (size) =>
          (await customersApi.listOk({ size })).pageInfo.totalCustomers,
      ),
    );

    expect(totals.reduce((a, b) => a + b, 0)).toBe(all.pageInfo.totalCustomers);
  });

  test("sum of totals per industry equals the unfiltered total", async ({
    customersApi,
  }) => {
    const all = await customersApi.listOk();
    const totals = await Promise.all(
      INDUSTRIES.map(
        async (industry) =>
          (await customersApi.listOk({ industry })).pageInfo.totalCustomers,
      ),
    );

    expect(totals.reduce((a, b) => a + b, 0)).toBe(all.pageInfo.totalCustomers);
  });

  test("filter with no results: empty list, totalPages 0 and currentPage 1", async ({
    customersApi,
  }) => {
    // Dynamically finds an empty combination, so the test does not depend on the current seed
    const combos = CUSTOMER_SIZES.flatMap((size) =>
      INDUSTRIES.map((industry) => ({ size, industry })),
    );
    const results = await Promise.all(
      combos.map(async (query) => ({
        query,
        body: await customersApi.listOk(query),
      })),
    );
    const empty = results.find((r) => r.body.pageInfo.totalCustomers === 0);

    test.skip(!empty, "No empty size+industry combination in the current seed");

    expect(empty!.body.customers).toEqual([]);
    expect(empty!.body.pageInfo).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalCustomers: 0,
    });
  });
});
