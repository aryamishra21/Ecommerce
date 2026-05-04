import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { authorize } from "apps/api/src/middlewares/role.middleware.js";
import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "shared/dist/index.js";

const router = Router();
/** Public Routes */

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

/** Admin Routes */

router.post(
  "/",
  protect,
  authorize("admin"),
  validate({ body: createCategorySchema }),
  createCategoryController,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate({ body: updateCategorySchema }),
  updateCategoryController,
);

router.delete("/:id", protect, authorize("admin"), deleteCategoryController);

export default router;
