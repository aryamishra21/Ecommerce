import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../../product/models/product.model.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";

export const getCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: new mongoose.Types.ObjectId(),
      items: [],
    });
  }
  return cart;
};
export const addToCart = async (
  userId: string,
  productId: string,
  variantSku: string,
  quantity: number,
) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found!");

  const variant = product.variants.find((v) => v.sku === variantSku);

  if (!variant) {
    throw new ApiError(400, "Invalid variant SKU");
  }
  if (variant.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }
  const price = variant.price ?? product.discountPrice ?? product.basePrice;
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: new mongoose.Types.ObjectId(userId),
      items: [],
    });
  }
  let existingItem = cart.items.find(
    (item) =>
      item.variantSku === variantSku && item.product.toString() === productId,
  );
  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (variant.stock < newQty) {
      throw new ApiError(400, "Not enough stock available");
    }
    existingItem.quantity = newQty;
  } else {
    cart.items.push({
      product: new mongoose.Types.ObjectId(productId),
      variantSku,
      quantity,
      price,
      name: product.name,
      image: product.images[0],
    } as any);
  }
  await cart.save();
  return cart;
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  variantSku: string,
  quantity: number,
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find(
    (i) => i.product.toString() === productId && i.variantSku === variantSku,
  );
  if (!item) throw new ApiError(404, "Cart item not found");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found!");

  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) {
    throw new ApiError(400, "Invalid variant SKU");
  }
  if (variant.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }
  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeCartItem = async (
  userId: string,
  productId: string,
  variantSku: string,
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");
  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId && item.variantSku === variantSku
      ),
  );
  await cart.save();
};
export const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");
  cart.items = [];
  await cart.save();
};
