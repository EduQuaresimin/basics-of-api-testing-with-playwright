import { z } from "zod";
import { CUSTOMER_SIZES, INDUSTRIES } from "./enums";

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1), // string: preserves leading zeros and hyphens
  country: z.string().min(1),
});

export const ContactInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const CustomerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  employees: z.number().int().nonnegative(),
  industry: z.enum(INDUSTRIES),
  size: z.enum(CUSTOMER_SIZES),
  contactInfo: ContactInfoSchema.nullable(),
  address: AddressSchema.nullable(),
});

export type Customer = z.infer<typeof CustomerSchema>;
