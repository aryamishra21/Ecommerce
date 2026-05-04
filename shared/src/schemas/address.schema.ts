import { z } from "zod";
export const createAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10).max(15),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4).max(10),
  country: z.string().min(2).default("India"),
});
export const updateAddressSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),
  addressLine1: z.string().min(5).optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  pincode: z.string().min(4).max(10).optional(),
  country: z.string().min(2).optional(),
  isDefault: z.boolean().optional(),
});
