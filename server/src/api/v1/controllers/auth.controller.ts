import { Request, Response } from "express";
import { Types } from "mongoose";

import { AuthService } from "@/api/v1/services/auth.service";
import { profileUpdateSchema } from "@/schemas/profileUpdateSchema";
import { LoginInput, RegisterInput } from "@/types/auth/auth.types";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

const authService = new AuthService();

// register handler
export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName)
      throw new BadRequestError("all fields are required.");

    const result = await authService.register(req.body as RegisterInput);

    const { accessToken, refreshToken } = result.token;

    res
      .status(201)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        status: "ok",
        message: "User registration successfull",
        data: result.user,
      });
  },
);

// login handler
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body as LoginInput;

    if (!username || !email || !password)
      throw new BadRequestError("All fields are required.");

    const response = await authService.login(req.body);

    const { accessToken, refreshToken } = response.token;

    res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        status: "ok",
        message: "User logged in successfully.",
        data: response.user,
      });
  },
);

// reset password handler
export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword as string;

    if (!newPassword) throw new BadRequestError("Please provide password");
    const userId = req.user._id as Types.ObjectId;

    const result = await authService.resetPassword(userId, newPassword);

    res.status(200).json({
      status: "ok",
      message: "Password updated successfully.",
      data: result.user,
    });
  },
);

// update profile handler
export const updateProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userInput: { username: string; password: string } = req.body;
    const userId = req.user._id as Types.ObjectId;

    const parsedData = profileUpdateSchema.parse(userInput);

    const result = await authService.updateProfile(parsedData, userId);

    res.status(200).json({
      status: "ok",
      message: "Profile updated successfully.",
      data: result,
    });
  },
);