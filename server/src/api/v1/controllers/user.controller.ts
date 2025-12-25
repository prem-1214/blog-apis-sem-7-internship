import { Request, Response } from "express";
import { Types } from "mongoose";

import { UserService } from "@/api/v1/services/user.service";
import { asyncHandler } from "@/utils/asyncHandler";
import { BadRequestError } from "@/utils/AppError";

const userService = new UserService();

export const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id as Types.ObjectId;

    if (!userId) throw new BadRequestError("User not found");

    const response = await userService.getUserById(userId);

    res.status(200).json({
      status: "ok",
      message: "User profile fetched successfully.",
      data: response,
    });
  },
);
