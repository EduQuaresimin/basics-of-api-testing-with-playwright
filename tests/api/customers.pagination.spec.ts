import { test, expect } from "../../fixtures/api.fixture";

test.describe("GET /customers: pagination", () => {
  for (const limit of [5, 10, 25, 7]) {
    test(`limit=${limit}: respects the limit and totalPages = ceil(total / limit)`, async ({
      customersApi,
    }) => {
      const { customers, pageInfo } = await customersApi.listOk({ limit });

      expect(customers.length).toBeLessThanOrEqual(limit);
      expect(pageInfo.totalPages).toBe(
        Math.ceil(pageInfo.totalCustomers / limit),
      );
    });
  }

  test("limit above the total returns every customer in a single page", async ({
    customersApi,
  }) => {
    const { customers, pageInfo } = await customersApi.listOk({ limit: 1000 });

    expect(customers).toHaveLength(pageInfo.totalCustomers);
    expect(pageInfo.totalPages).toBe(1);
  });

  test("last page contains only the remaining items", async ({
    customersApi,
  }) => {
    const limit = 10;
    const first = await customersApi.listOk({ limit });
    const lastPage = first.pageInfo.totalPages;

    const { customers, pageInfo } = await customersApi.listOk({
      page: lastPage,
      limit,
    });

    expect(pageInfo.currentPage).toBe(lastPage);
    expect(customers).toHaveLength(
      first.pageInfo.totalCustomers - (lastPage - 1) * limit,
    );
  });

  test("page above totalPages returns 200 with an empty list", async ({
    customersApi,
  }) => {
    const { customers } = await customersApi.listOk({ page: 999 });

    expect(customers).toEqual([]);
  });

  test("different pages do not repeat customers", async ({ customersApi }) => {
    const page1 = await customersApi.listOk({ page: 1, limit: 10 });
    const page2 = await customersApi.listOk({ page: 2, limit: 10 });

    const ids1 = new Set(page1.customers.map((c) => c.id));
    expect(page2.customers.filter((c) => ids1.has(c.id))).toEqual([]);
  });

  test("walking through all pages returns each customer exactly once", async ({
    customersApi,
  }) => {
    const limit = 10;
    const first = await customersApi.listOk({ limit });
    const pages = await Promise.all(
      Array.from({ length: first.pageInfo.totalPages }, (_, i) =>
        customersApi.listOk({ page: i + 1, limit }),
      ),
    );

    const ids = pages.flatMap((p) => p.customers.map((c) => c.id));
    expect(ids).toHaveLength(first.pageInfo.totalCustomers);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
