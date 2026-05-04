import { protect } from "apps/api/src/middlewares/auth.middleware.js";
import { Router } from "express";
import {
  addAddressController,
  deleteAddressController,
  getAddressController,
  updateAddressController,
} from "../controllers/address.controller.js";
import { validate } from "apps/api/src/middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "shared/dist/index.js";

const router = Router();
router.use(protect);
router.get("/", getAddressController);
router.post("/", validate({ body: createAddressSchema }), addAddressController);
router.put("/:addressId", validate({ body: updateAddressSchema }), updateAddressController);
router.delete("/:addressId",deleteAddressController);

export default router;


