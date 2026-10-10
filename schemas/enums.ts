export const CUSTOMER_SIZES = [
  "Small",
  "Medium",
  "Enterprise",
  "Large Enterprise",
  "Very Large Enterprise",
] as const;

export const INDUSTRIES = [
  "Logistics",
  "Retail",
  "Technology",
  "HR",
  "Finance",
] as const;

export type CustomerSize = (typeof CUSTOMER_SIZES)[number];
export type Industry = (typeof INDUSTRIES)[number];
