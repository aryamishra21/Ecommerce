import { ApiError } from "apps/api/src/utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../../cart/models/cart.model.js";
import { User } from "../../user/models/user.model.js";
import { Product } from "../../product/models/product.model.js";

export const createOrderFromCart = async (
  userId: string,
  addressId: string,
  paymentMethod: "cod" | "razorpay" | "stripe",
) => {
  // check cart
  // check user
  // check address in user by id
  // validate stock
  // for each item isProductActive ? variant available? variantstock>item.quantity?
  //create orderitems with data
  //shipping charge,totalAmount
  // sub quantity for variant from product
  //create order empty cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0)
    throw new ApiError(400, "Cart is empty");
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  const address = user.addresses.find(
    (address) => address._id.toString() === addressId,
  );
  if (!address) throw new ApiError(400, "Address not found");
  const orderItems: any[] = [];
  // Validate stock + create snapshot
  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      throw new ApiError(404, `Product not found`);
    }
    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }
    if (variant.stock < item.quantity) {
      throw new ApiError(
        400,
        `Not enough stock for ${product.name} (${variant.sku})`,
      );
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      variantSku: variant.sku,
      attributes: Object.entries(variant.attributes as any),
      quantity: item.quantity,
      price: item.price,
    });
  }
  const shippingCharge = cart.totalPrice > 500 ? 0 : 50;
  const totalAmount = cart.totalPrice + shippingCharge;
  // Deduct stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    const variant = product!.variants.find((v) => v.sku === item.variantSku);
    variant!.stock -= item.quantity;
    await product!.save();
  }
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingCharge,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    status: "pending",
    addressSnapshot: address,
  });
  // Clear cart after order created
  cart.items = [];
  await cart.save();
  return order;
};
export const getMyOrders = async (userId: string) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (userId: string, orderId: string) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");
  if (order.status != "pending") {
    throw new ApiError(400, "Order cannot be cancelled now");
  }
  order.status = "cancelled";
  await order.save();
  return order;
};

export const updateOrderStatusAdmin = async (
  status: string,
  orderId: string,
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  order.status = status as any;
  await order.save();
  return order;
};
