import type { Request, Response } from "express";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart.services.js";

export const getCartController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const cart = await getCart(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  },
);
export const updateCartItemController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { productId, variantSku } = req.params;
    if (!productId || Array.isArray(productId))
      throw new ApiError(400, "productId is required");
    if (!variantSku || Array.isArray(variantSku))
      throw new ApiError(400, "variantSku is required");
    const { quantity } = req.body;
    const cart = await updateCartItem(
      req.user.userId,
      productId,
      variantSku,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  },
);
export const addToCartController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { productId, variantSku, quantity } = req.body;
    const cart = await addToCart(
      req.user.userId,
      productId,
      variantSku,
      quantity,
    );
    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  },
);

export const removeCartItemController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { productId, variantSku } = req.params;
    if (!productId || Array.isArray(productId))
      throw new ApiError(400, "productId is required");
    if (!variantSku || Array.isArray(variantSku))
      throw new ApiError(400, "variantSku is required");
    const cart = await removeCartItem(req.user.userId, productId, variantSku);
    res.status(200).json({
      success: true,
      message: "Cart item removed",
      data: cart,
    });
  },
);
export const clearCartController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");

    const cart = await clearCart(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  },
);
