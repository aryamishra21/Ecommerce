import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { Router } from "express";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeCartItemController,
} from "../controllers/cart.controller.js";
import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import { addToCartSchema } from "shared/dist/index.js";

const router = Router();
router.use(protect);
router.get("/", getCartController);

router.post("/", validate({ body: addToCartSchema }), addToCartController);
router.delete("/:productId/:variantSku", removeCartItemController);
router.delete("/", clearCartController);

export default router;
