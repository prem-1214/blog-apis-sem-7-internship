import { Request, Response } from "express";
import { Types } from "mongoose";

import { userService } from "@/api/v1/services/user.service";
import { SuccessMessages } from "@/constants/successMessage";
import { successResponse } from "@/utils/ApiResponse";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

// user controller object
export const userController = {
  getUserProfileHandler: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id as Types.ObjectId;
    if (!userId) throw new BadRequestError("User not found");

    const result = await userService.getUserById(userId);

    const response = successResponse(result, {
      message: SuccessMessages.FETCHED("User profile"),
    });

    return res.json(response);
  }),
};
