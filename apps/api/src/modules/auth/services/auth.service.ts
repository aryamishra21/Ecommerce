import bcrypt from "bcrypt";
import { User } from "../../user/models/user.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "apps/api/src/utils/jwt.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";
import { generateHashedToken } from "apps/api/src/utils/token.js";
import { env } from "apps/api/src/config/env.js";
import { sendEmail } from "apps/api/src/utils/email.js";
import crypto from "crypto";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "Email already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log(user._id, "user");
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  await sendVerificationEmail(user.email);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new ApiError(400, "User not found.");
    // throw { statusCode: 400, message: "User not found." };
  }
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials.");
  }
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (refreshToken: string) => {
  let decoded: any;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }
  const user = await User.findOne({
    _id: decoded.userId,
    refreshToken: refreshToken,
  });

  if (!user) {
    throw new ApiError(401, "Refresh token reuse detected or invalid token");
  }
  const newAccessToken = signAccessToken({ userId: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id });
  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  const user = await User.findOne({ refreshToken });
  if (!user) return;
  user.refreshToken = null as any;
  await user.save();
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const { hashToken, rawToken } = generateHashedToken();
  user.resetPasswordToken = hashToken;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  await user.save();
  const resetUrl = `${env.BASE_URL}/reset-password?token=${rawToken}`;
  await sendEmail(
    user.email,
    "Reset your password",
    `Reset your password using this link: ${resetUrl}`,
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  // invalidate reset token
  user.resetPasswordExpire = null as any;
  user.resetPasswordToken = null as any;
  // invalidate refresh token (force logout from all devices)
  user.refreshToken = null as any;
  await user.save();
};

export const sendVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { hashToken, rawToken } = generateHashedToken();
  user.emailVerificationToken = hashToken;
  user.emailVerificationExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();
  const resetUrl = `${env.BASE_URL}/reset-password?token=${rawToken}`;
  await sendEmail(
    user.email,
    "Reset your password",
    `Reset your password using this link: ${resetUrl}`,
  );
};
export const verifyEmail = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: new Date() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }
  user.isEmailVerified = true;

  user.emailVerificationToken = null as any;
  user.emailVerificationExpire = null as any;

  await user.save();
};
