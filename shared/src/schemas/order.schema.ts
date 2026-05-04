import z from "zod";

export const createOrderSchema=z.object({
    addressId:z.string().min(5),
    paymentMethod:z.enum(["cod","razorpay","stripe"]),
})