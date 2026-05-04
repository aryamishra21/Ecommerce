import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductBySlugController,
  updateProductController,
} from "../controllers/product.controller.js";
import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { authorize } from "apps/api/src/middlewares/role.middleware.js";
import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "shared/dist/index.js";

const router = Router();
/** Public Routes */
router.get("/", getAllProductsController);

router.get("/:slug", getProductBySlugController);

/** Admin Routes */
router.post(
  "/",
  protect,
  authorize("admin"),
  validate({ body: createProductSchema }),
  createProductController,
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate({ body: updateProductSchema }),
  updateProductController,
);

router.delete("/:id", protect, authorize("admin"), deleteProductController);

export default router;