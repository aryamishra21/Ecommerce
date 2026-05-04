import mongoose, { Document, Schema } from "mongoose";
export interface IProductVariant {
  sku: string;
  attributes: Record<string, string>;
  price?: number;
  stock: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  brand: string | null;
  tags: string[];
  images: string[];
  basePrice: number;
  discountPrice: number | null;
  variants: IProductVariant[];
  totalStock: number;
  avgRating: number;
  numReviews: number;
  isActive: boolean;
}

const variantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  attributes: {
    type: Object,
    required: true,
  },
  price: { type: Number },
  stock: { type: Number, required: true, min: 0 },
});
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
// Auto-calc total stock
productSchema.pre("save", function () {
  this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
});
productSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);
export const Product = mongoose.model<IProduct>("Product", productSchema);
