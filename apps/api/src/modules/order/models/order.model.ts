import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  variantSku: string;
  attributes: Record<string, string>;
  quantity: number;
  price: number;
}
export interface IOrder {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];

  totalAmount: number;
  shippingCharge: number;

  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  paymentMethod: "cod" | "razorpay" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";

  addressSnapshot: any;
}
const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    variantSku: {
      type: String,
      required: true,
    },
    attributes: {
      type: Object,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    addressSnapshot: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
