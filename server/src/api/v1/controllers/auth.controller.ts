import { Request, Response } from "express";
import { Types } from "mongoose";

import { AuthService } from "@/api/v1/services/auth.service";
import { SuccessMessages } from "@/constants/successMessage";
import {
  profileUpdateSchema,
  profileUpdateSchemaType,
} from "@/schemas/profileUpdateSchema";
import { LoginInput, RegisterInput } from "@/types/auth.types";
import { UserResponseDTO } from "@/types/response.types";
import { successResponse } from "@/utils/ApiResponse";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

const authService = new AuthService();

// register handler
export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.register(req.body as RegisterInput);
    const { accessToken, refreshToken } = result.token;

    const response = successResponse<UserResponseDTO>(result.user, {
      message: SuccessMessages.REGISTER,
    });

    return res
      .status(201)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(response);
  },
);

// login handler
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login(req.body as LoginInput);
    const { accessToken, refreshToken } = result.token;

    const response = successResponse<UserResponseDTO>(result.user, {
      message: SuccessMessages.LOGIN,
    });

    return res
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(response);
  },
);

// reset password handler
export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword as string;
    if (!newPassword) throw new BadRequestError("Please provide password");

    const userId = req.user._id as Types.ObjectId;
    const result = await authService.resetPassword(userId, newPassword);

    const response = successResponse(result.user, {
      message: SuccessMessages.PASSWORD_RESET,
    });

    return res.json(response);
  },
);

// update profile handler
export const updateProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userInput: profileUpdateSchemaType = req.body;
    const userId = req.user._id as Types.ObjectId;
    const parsedData = profileUpdateSchema.parse(userInput);

    const result = await authService.updateProfile(parsedData, userId);

    const response = successResponse(result, {
      message: SuccessMessages.UPDATED("Profile"),
    });

    return res.json(response);
  },
);
