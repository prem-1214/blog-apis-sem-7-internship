import { Request, Response } from "express";
import { Types } from "mongoose";

import { UserService } from "@/api/v1/services/user.service";
import { ResponseHelper } from "@/utils/ApiResponse";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

const userService = new UserService();

export const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user._id as Types.ObjectId;

    if (!userId) throw new BadRequestError("User not found");

    const response = await userService.getUserById(userId);  // TODO: use same names for repository and services.

    return ResponseHelper.ok(
      res,
      "User profile fetched successfully",
      response,
    );
  },
);
