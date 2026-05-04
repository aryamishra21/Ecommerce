import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { Router } from "express";
import { getMeController } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", protect, getMeController);
export default router;
