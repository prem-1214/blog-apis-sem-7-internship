import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { authRepository } from "@/api/v1/repositories/auth.repository";
import { cacheService } from "@/api/v1/services/cache.service";
import { loginSchema, registerSchema } from "@/api/v1/validators/authSchema";
import { profileUpdateSchemaType } from "@/api/v1/validators/profileUpdateSchema";
import { userMapper } from "@/mappers/user.mapper";
import { AuthResponseDTO, LoginInput, RegisterInput } from "@/types/auth.types";
import { UserDocument, UserResponseDTO } from "@/types/user.types";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/AppError";
import { generateAccessToken, generateRefreshToken } from "@/utils/token.util";

// auth service object
export const authService = {
  // register service
  register: async (data: RegisterInput): Promise<AuthResponseDTO> => {
    const parsedData = registerSchema.parse(data);

    if (parsedData.password.length < 8)
      throw new BadRequestError("Password must be 8 characters long.");

    const existingUser = await authRepository.findByEmail(parsedData.email);

    if (existingUser)
      throw new BadRequestError("User already exists with this email");

    // check if userName is available
    const userNameAlreadyTaken = await authRepository.checkUserNameAvailability(
      parsedData.userName,
    );

    if (userNameAlreadyTaken)
      throw new BadRequestError("This userName is already taken");

    const hashedPassowrd = await bcrypt.hash(parsedData.password, 10);

    // Create user and get UserResponseDTO
    const user = await authRepository.createUser({
      ...parsedData,
      password: hashedPassowrd,
    });

    const accessToken = generateAccessToken({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken(user._id);

    await authRepository.updateRefreshToken(user._id, refreshToken);

    cacheService.setCache(
      `refreshToken:${user._id}`,
      refreshToken,
      60 * 60 * 24,
    );

    return {
      user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  },

  login: async (data: LoginInput): Promise<AuthResponseDTO> => {
    const parsedData = loginSchema.parse(data);

    if (parsedData.password.length < 8)
      throw new BadRequestError("Password must be 8 characters long.");

    // Use findByEmailForAuth to get full user with password
    const existingUser = await authRepository.findByEmailForAuth(
      parsedData.email,
    );

    if (!existingUser) throw new NotFoundError("User not found");

    if (!existingUser.isAccountActive)
      throw new UnauthorizedError(
        "Your Account is Currently disabled! Please contact support.",
      );

    if (existingUser.userName !== parsedData.userName)
      throw new BadRequestError("Username not found.");

    const verifiedPassword = await bcrypt.compare(
      parsedData.password,
      existingUser.password,
    );

    if (!verifiedPassword) throw new UnauthorizedError("Wrong Password!");

    const accessToken = generateAccessToken({
      _id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    });
    const refreshToken = generateRefreshToken(existingUser._id);

    await authRepository.updateRefreshToken(existingUser._id, refreshToken);

    cacheService.setCache(
      `refreshToken:${existingUser._id}`,
      refreshToken,
      60 * 60 * 24,
    );

    // Map to UserResponseDTO (without password) for response
    const userResponse = userMapper(existingUser);

    return {
      user: userResponse,
      token: {
        accessToken,
        refreshToken,
      },
    };
  },

  resetPassword: async (
    userId: Types.ObjectId,
    newPassword: string,
  ): Promise<{ status: string; user: UserDocument | null }> => {
    try {
      if (!newPassword || newPassword.length < 8)
        throw new BadRequestError("Please provide password 8 characters long");
      const user = await authRepository.findById(userId);

      if (!user) throw new BadRequestError("User not found");

      const oldPassword = user?.password as string;

      if (!oldPassword) throw new BadRequestError("Password not found.");

      if (oldPassword === newPassword)
        throw new BadRequestError("both old and new password are same.");

      const newHashedPAssword: string = await bcrypt.hash(newPassword, 10);

      const updatedUser = await authRepository.findUserAndResetPassword(
        userId,
        newHashedPAssword,
      );

      return {
        status: "ok",
        user: updatedUser,
      };
    } catch {
      throw new BadRequestError("Password reset failed !");
    }
  },

  updateProfile: async (
    userInput: profileUpdateSchemaType,
    userId: Types.ObjectId,
  ): Promise<UserResponseDTO> => {
    try {
      if (!userInput) throw new BadRequestError("No field selected to update!");

      return await authRepository.updateProfileById(userInput, userId);
    } catch {
      throw new AppError("Profile update failed!", 500);
    }
  },
};
