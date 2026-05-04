import type { Request, Response, NextFunction } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../services/auth.service.js";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "apps/api/src/utils/cookies.js";
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);
    setRefreshTokenCookie(res, data.refreshToken);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: data.user,
        accessToken: data.accessToken,
      },
    });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    setRefreshTokenCookie(res, data.refreshToken);
    res.status(201).json({
      success: true,
      message: "Login successful",
      data: {
        user: data.user,
        accessToken: data.accessToken,
      },
    });
  },
);

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }
    const data = await refreshTokens(refreshToken);
    // rotate refresh token cookie
    setRefreshTokenCookie(res, data.refreshToken);
    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken: data.accessToken,
      },
    });
  },
);
export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    clearRefreshTokenCookie(res);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await forgotPassword(email);
    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  },
);
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await resetPassword(token, password);
    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  },
);

export const sendVerificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.user!;

    await sendVerificationEmail(userId);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  },
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body;

    await verifyEmail(token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  },
);
