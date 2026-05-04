import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { Category } from "../models/category.model.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";
import mongoose from "mongoose";

export const createCategory = async (name: string, parent?: string | null) => {
  const slug = slugify(name);
  const existing = await Category.findOne({ slug });
  if (existing)
    throw new ApiError(400, "Category with this name already exists");
  let level = 0;
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) throw new ApiError(404, "Parent category not found");
    level = parentCategory.level + 1;
  }
  const category = await Category.create({
    name,
    slug,
    parent: parent ? new mongoose.Types.ObjectId(parent) : null,
    level,
  });

  return category;
};
export const getAllCategories = async () => {
  return await Category.find().sort({ level: 1, name: 1 });
};
export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};
export const updateCategory = async (
  id: string,
  data: { name?: string; parent?: string; isActive: boolean },
) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  if (data.name) {
    const slug = slugify(data.name);
    const existing = await Category.findOne({ slug });
    if (existing)
      throw new ApiError(400, "Category with this name already exists");
  }

  if (!data.parent) {
    category.parent = null;
    category.level = 0;
  } else {
    const parentCategory = await Category.findById(data.parent);
    if (!parentCategory) throw new ApiError(404, "Parent category not found");
    category.parent = parentCategory._id;
    category.level = parentCategory.level + 1;
  }
  if (data.isActive != undefined) {
    category.isActive = data.isActive;
  }
  await category.save();
  return category;
};
export const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  const children = await Category.find({ parent: id });
  if (children.length > 0) {
    throw new ApiError(400, "Cannot delete category with subcategories");
  }
  await Category.deleteOne({ _id: id });
  return true;
};
