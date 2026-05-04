import z from "zod";

export const addToCartSchema=z.object({
    productId:z.string().min(5),
    variantSku:z.string().min(2),
    quantity:z.number().int().min(1).max(10),
})
export const updateCartItemSchema=z.object({
    quantity: z.number().int().min(1).max(10),
})