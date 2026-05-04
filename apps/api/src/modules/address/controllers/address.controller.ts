import { ApiError } from "apps/api/src/utils/ApiError.js";
import { asyncHandler } from "apps/api/src/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { User } from "../../user/models/user.model.js";
import mongoose from "mongoose";
export const addAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized.");
    const user = await User.findById(req.user.userId);
    if (!user) throw new ApiError(404, "User not found.");
    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      isDefault: user.addresses.length === 0,
    };
    user.addresses.push(newAddress);
    if (req.body.isDefault === true) {
      user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === newAddress._id.toString();
      });
    }
    await user.save();
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  },
);

export const getAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized.");
    const user = await User.findById(req.user.userId).select("addresses");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: user.addresses,
    });
  },
);

export const updateAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized.");
    const { addressId } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user) throw new ApiError(404, "User not found");
    const address = user.addresses.find(
      (addr) => addr._id.toString() === addressId?.toString(),
    );
    if (!address) throw new ApiError(404, "Address not found");
    Object.assign(address, req.body);

    if (req.body.isDefault === true) {
      user.addresses.forEach(
        (addr) => (addr.isDefault = addr._id.toString() === addressId),
      );
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  },
);

export const deleteAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authorized.");
    const { addressId } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user) throw new ApiError(404, "User not found");
    const addressToDelete = user.addresses.find(
      (addr) => addr._id.toString() === addressId,
    );
    if (!addressToDelete) throw new ApiError(404, "Address not found.");
    const wasDefault = addressToDelete.isDefault;
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressToDelete._id.toString(),
    );
    // if default deleted, make first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0]!.isDefault = true;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  },
);
