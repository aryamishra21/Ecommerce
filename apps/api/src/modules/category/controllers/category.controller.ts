import type { Request, Response } from "express";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../services/category.services.js";

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, parent } = req.body;
    const category = await createCategory(name, parent);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  },
);

export const getAllCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await getAllCategories();
    res.status(201).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  },
);

export const getCategoryByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }
    const category = await getCategoryById(id);
    res.status(201).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  },
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }
    const updatedCategory = await updateCategory(id, req.body);
    res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  },
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }
    await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  },
);
