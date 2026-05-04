import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authorized, token missing");
    }
    const token = authHeader.split(" ")[1] || "";

    const decoded = verifyAccessToken(token) as {
      userId: string;
      role: string;
      iat: number;
      exp: number;
    };
    req.user = {
      userId: decoded.userId,
      role: decoded.role as any,
    };
    next();
  },
);
