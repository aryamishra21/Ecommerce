import { ApiError } from "apps/api/src/utils/ApiError.js";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { User } from "../models/user.model.js";

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized");
    }
    const user = await User.findById(req.user.userId).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  },
);
