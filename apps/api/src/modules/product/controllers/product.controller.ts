import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import type { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
} from "../services/product.services.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";

export const createProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);
export const getAllProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getAllProducts(req.query);
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data,
    });
  },
);

export const getProductBySlugController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!slug || typeof slug != "string") {
      throw new ApiError(400, "Slug is required");
    }
    const product = await getProductBySlug(slug);
    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);

export const updateProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id != "string") {
      throw new ApiError(400, "ProductID is required");
    }
    const product = await updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },
);

export const deleteProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id != "string") {
      throw new ApiError(400, "ProductID is required");
    }
    await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);
