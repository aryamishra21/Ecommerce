import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import { Router } from "express";
import { createOrderSchema } from "shared/dist/index.js";
import {
  cancelOrderController,
  createOrderController,
  getOrderController,
  myOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import { authorize } from "apps/api/src/middlewares/role.middleware.js";

const router = Router();

router.use(protect);

/** User Routes */
router.post("/", validate({ body: createOrderSchema }), createOrderController);
router.get("/my", myOrdersController);
router.get("/:id", getOrderController);
router.put("/:id/cancel", cancelOrderController);

/** Admin Route */

router.put("/:id/status", authorize("admin"), updateOrderStatusController);

export default router;