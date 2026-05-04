import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: mongoose.Types.ObjectId | null;
  level: number;
  isActive: boolean;
}

export const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
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
export const Category = mongoose.model<ICategory>("Category", categorySchema);
