import { Request, Response } from "express";
import { Types } from "mongoose";

import { authService } from "@/api/v1/services/auth.service";
import {
  profileUpdateSchema,
  profileUpdateSchemaType,
} from "@/api/v1/validators/profileUpdateSchema";
import { config } from "@/config/config";
import { SuccessMessages } from "@/constants/successMessage";
import { LoginInput, RegisterInput } from "@/types/auth.types";
import { UserResponseDTO } from "@/types/user.types";
import { successResponse } from "@/utils/ApiResponse";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

// Cookie options for secure token handling
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: config.get("NODE_ENV") === "production",
  sameSite: "strict" as const,
  maxAge,
});

// auth controller object
export const authController = {
  // register handler
  registerHandler: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body as RegisterInput);
    const { accessToken, refreshToken } = result.token;

    const response = successResponse<UserResponseDTO>(result.user, {
      message: SuccessMessages.REGISTER,
    });

    return res
      .status(201)
      .cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)) // 15 minutes
      .cookie(
        "refreshToken",
        refreshToken,
        getCookieOptions(7 * 24 * 60 * 60 * 1000),
      ) // 7 days
      .json(response);
  }),

  // login handler
  loginHandler: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body as LoginInput);
    const { accessToken, refreshToken } = result.token;

    const response = successResponse<UserResponseDTO>(result.user, {
      message: SuccessMessages.LOGIN,
    });

    return res
      .cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)) // 15 minutes
      .cookie(
        "refreshToken",
        refreshToken,
        getCookieOptions(7 * 24 * 60 * 60 * 1000),
      ) // 7 days
      .json(response);
  }),

  // logout handler
  logoutHandler: asyncHandler(async (req: Request, res: Response) => {
    const response = successResponse(null, {
      message: SuccessMessages.LOGOUT,
    });

    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(response);
  }),

  // reset password handler
  resetPasswordHandler: asyncHandler(async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword as string;
    if (!newPassword) throw new BadRequestError("Please provide password");

    const userId = req.user._id as Types.ObjectId;
    const result = await authService.resetPassword(userId, newPassword);

    const response = successResponse(result.user, {
      message: SuccessMessages.PASSWORD_RESET,
    });

    return res.json(response);
  }),

  // update profile handler
  updateProfileHandler: asyncHandler(async (req: Request, res: Response) => {
    const userInput: profileUpdateSchemaType = req.body;
    const userId = req.user._id as Types.ObjectId;
    const parsedData = profileUpdateSchema.parse(userInput);

    const result = await authService.updateProfile(parsedData, userId);

    const response = successResponse(result, {
      message: SuccessMessages.UPDATED("Profile"),
    });

    return res.json(response);
  }),
};
