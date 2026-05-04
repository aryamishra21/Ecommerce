import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import { Router } from "express";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "shared";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  resetPasswordController,
  sendVerificationController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { protect } from "apps/api/src/middlewares/auth.middleware.js";

const router = Router();
router.post(
  "/register",
  validate({ body: registerSchema }),
  registerController,
);

router.post("/login", validate({ body: loginSchema }), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPasswordController,
);
router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  resetPasswordController,
);
router.post("/send-verification", protect, sendVerificationController);

router.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  verifyEmailController,
);

export default router;
