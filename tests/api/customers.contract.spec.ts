import { test, expect } from "../../fixtures/api.fixture";
import type { CustomerSize } from "../../schemas/enums";

// Rule INFERRED from the sample data. Confirm with the API team.
function expectedSize(employees: number): CustomerSize {
  if (employees < 100) return "Small";
  if (employees < 1000) return "Medium";
  if (employees < 10000) return "Enterprise";
  if (employees < 50000) return "Large Enterprise";
  return "Very Large Enterprise";
}

test.describe("GET /customers: contract", () => {
  test("without params: validates the full contract with defaults page=1 and limit=10", async ({
    customersApi,
  }) => {
    const { customers, pageInfo } = await customersApi.listOk();

    expect(pageInfo.currentPage).toBe(1);
    expect(customers).toHaveLength(10);
  });

  test("explicit empty query (?page=) is NOT the same as the default: returns 400", async ({
    customersApi,
  }) => {
    const response = await customersApi.listRaw({ page: "" });

    expect(response.status()).toBe(400);
  });

  test("size is consistent with the number of employees", async ({
    customersApi,
  }) => {
    const { customers } = await customersApi.listOk({ limit: 50 });

    for (const c of customers) {
      expect
        .soft(c.size, `Customer ${c.id} (${c.employees} employees)`)
        .toBe(expectedSize(c.employees));
    }
  });
});
