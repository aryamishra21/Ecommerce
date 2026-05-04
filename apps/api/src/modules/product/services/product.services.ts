import { Product, type IProduct } from "../models/product.model.js";
import { ApiError } from "apps/api/src/utils/ApiError.js";
import { Category } from "../../category/models/category.model.js";
import mongoose from "mongoose";
import { slugify } from "apps/api/src/utils/slugify.js";

export const createProduct = async (data: any) => {
  const slug = slugify(data.name);
  const exists = await Product.findOne({ slug, isActive: true });
  if (exists) {
    throw new ApiError(400, "Product with this name already exists");
  }
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) throw new ApiError(400, "Category doesn't exists");
  // Ensure variants have required fields
  if (data.variants && Array.isArray(data.variants)) {
    data.variants = data.variants.map((v: any) => ({
      sku: v.sku,
      attributes: v.attributes,
      price: v.price,
      stock: v.stock ?? 0, // Ensure stock is present
    }));
  }
  const product = await Product.create({
    ...data,
    slug,
    category: new mongoose.Types.ObjectId(data.category),
  });
  return product;
};

export const getAllProducts = async (query: any) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    tag,
    sortBy,
    page = 1,
    limit = 10,
  } = query;
  const filter: any = { isActive: true };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }
  if (tag) {
    filter.tags = tag;
  }
  if (brand) {
    filter.brand = brand;
  }
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }
  let sort: any = { createdAt: -1 };
  if (sortBy === "price_low") sort = { basePrice: 1 };
  if (sortBy === "price_high") sort = { basePrice: -1 };
  if (sortBy === "newest") sort = { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));
  const total = await Product.countDocuments(filter);
  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  if (data.name) {
    const newSlug = slugify(data.name);
    const slugExists = await Product.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });
    if (slugExists) throw new ApiError(400, "Product name already exists");
    product.slug = newSlug;
    product.name = data.name;
  }
  Object.assign(product, data);
  await product.save();
  return product;
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, isActive: true }).populate(
    "category",
    "name slug",
  );
  if (!product) throw new ApiError(404, "Product not found");

  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  //   await Product.deleteOne({ _id: id });
  product.isActive = false;
  await product.save();
  return true;
};
