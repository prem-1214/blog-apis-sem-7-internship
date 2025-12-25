import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { AuthRepository } from "@/api/v1/repositories/auth.repository";
import { cacheService } from "@/api/v1/services/cache.service";
import { LoginInput, RegisterInput } from "@/types/auth/auth.types";
import { IUser } from "@/types/user.types";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/AppError";
import { generateAccessToken, generateRefreshToken } from "@/utils/token.util";
import { profileUpdateSchemaType } from "@/schemas/profileUpdateSchema";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  // register service
  async register(data: RegisterInput): Promise<{
    user: IUser;
    token: { accessToken: string; refreshToken: string };
  }> {
    if (data.password.length < 8)
      throw new BadRequestError("Password must be 8 characters long.");

    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser)
      throw new BadRequestError("User already exists with this email");

    // TODO: email varification for actual users

    // check if username is available
    const usernameAlreadyTaken =
      await this.authRepository.checkUserNameAvailability(data.username);

    if (usernameAlreadyTaken)
      throw new BadRequestError("This username is already taken");

    const hashedPassowrd = await bcrypt.hash(data.password, 10);
    // send hashed password in db
    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassowrd,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    await this.authRepository.updateRefreshToken(user._id, refreshToken);

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
  }

  async login(data: LoginInput): Promise<{
    user: IUser;
    token: { accessToken: string; refreshToken: string };
  }> {
    if (data.password.length < 8)
      throw new BadRequestError("Password must be 8 characters long.");

    const existingUser = (await this.authRepository.findByEmail(
      data.email,
    )) as IUser;

    if (!existingUser?.isAccountActive)
      throw new UnauthorizedError(
        "Your Account is Currently disabled ! Please contact admin",
      );

    if (existingUser?.username !== data.username)
      throw new BadRequestError("Username not found.");

    if (!existingUser) throw new NotFoundError("User not found");

    const verifiedPassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );

    if (!verifiedPassword) throw new UnauthorizedError("wrong Password!");

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser._id);

    await this.authRepository.updateRefreshToken(
      existingUser._id,
      refreshToken,
    );

    cacheService.setCache(
      `refreshToken:${existingUser._id}`,
      refreshToken,
      60 * 60 * 24,
    );

    return {
      user: existingUser,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  async resetPassword(
    userId: Types.ObjectId,
    newPassword: string,
  ): Promise<{ status: string; user: IUser | null }> {
    try {
      if (!newPassword || newPassword.length < 8)
        throw new BadRequestError("Please provide password 8 characters long");
      const user = await this.authRepository.findById(userId);

      if (!user) throw new BadRequestError("User not found");

      const oldPassword = user?.password as string;

      if (!oldPassword) throw new BadRequestError("Password not found.");

      if (oldPassword === newPassword)
        throw new BadRequestError("both old and new password are same.");

      const newHashedPAssword: string = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.authRepository.findUserAndResetPassword(
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
  }

  async updateProfile(
    userInput: profileUpdateSchemaType,
    userId: Types.ObjectId,
  ): Promise<IUser> {
    try {
      if (!userInput) throw new BadRequestError("No field selected to update!");

      return await this.authRepository.updateProfileById(userInput, userId);
    } catch {
      throw new AppError("Profile update failed!", 500);
    }
  }
}
