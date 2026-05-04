import z from "zod";

export const productVariantSchema=z.object({
    sku:z.string().min(3),
    attributes:z.record(z.string(),z.string()),
    price:z.number().int().min(0),
    stock:z.number()
})

export const createProductSchema=z.object({
    name:z.string().min(2),
    description:z.string().min(10),
    category:z.string().min(5),
    brand:z.string().optional().nullable(),
    tags:z.array(z.string()).default([]),
    images:z.array(z.string()).min(1),
    basePrice:z.number().positive(),
    discountPrice:z.number().positive().optional().nullable(),
    variants:z.array(productVariantSchema).min(1),
    isActive:z.boolean().optional()
})
export const updateProductSchema=z.object({
    name:z.string().min(2).optional(),
    description:z.string().min(10).optional(),
    category:z.string().optional(),
    brand:z.string().optional().nullable(),
    tags:z.array(z.string()).optional(),
    images:z.array(z.string()).min(1).optional(),
    basePrice:z.number().positive().optional(),
    discountPrice:z.number().positive().optional().nullable(),
    variants:z.array(productVariantSchema).optional(),
    isActive:z.boolean().optional(),
})