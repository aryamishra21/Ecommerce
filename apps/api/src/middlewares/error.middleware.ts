import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ ERROR:", err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  const message = err.message || "Internal Server Error";
  res.status(500).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
