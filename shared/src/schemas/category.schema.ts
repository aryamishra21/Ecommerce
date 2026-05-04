import {z} from "zod";
export const createCategorySchema=z.object({
    name:z.string().min(2),
    parent:z.string().optional().nullable(),
})
export const updateCategorySchema=z.object({
    name:z.string().optional(),
    parent:z.string().optional().nullable(),
    isActive:z.boolean().optional()
})
