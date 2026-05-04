import { ApiError } from "apps/api/src/utils/ApiError.js";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import type { Request, Response } from "express";
import {
  cancelOrder,
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  updateOrderStatusAdmin,
} from "../services/order.services.js";

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { addressId, paymentMethod } = req.body;
    const order = await createOrderFromCart(
      req.user.userId,
      addressId,
      paymentMethod,
    );
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  },
);

export const myOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const orders = await getMyOrders(req.user.userId);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  },
);

export const getOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Order id not provided");
    const order = await getOrderById(req.user.userId, id.toString());
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  },
);

export const cancelOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized");
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Order id not provided");
    const order = await cancelOrder(req.user.userId, id.toString());
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  },
);
export const updateOrderStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Order id not provided");
    const order = await updateOrderStatusAdmin(status, id.toString());
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  },
);
