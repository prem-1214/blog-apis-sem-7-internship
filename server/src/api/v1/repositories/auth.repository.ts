import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import { IUser } from "@/types/user.types";
import { AppError } from "@/utils/AppError";

// user repository class
export class AuthRepository {
  // find user by _id
  async findById(_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById({ _id: _id });
  }

  // find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    return (await User.findOne({ email: email })) as IUser;
  }

  //   create user
  async createUser(userData: Partial<IUser>) {
    try {
      const defaultRole = await Role.findOne({ name: "user" });

      const user = new User({
        ...userData,
        isEmailVarified: true,
        isAccountActive: true,
        role: defaultRole?._id,
      });

      return await user.save();
    } catch {
      throw new AppError("Error creating user", 400);
    }
  }

  // update refreshtoken in DB
  async updateRefreshToken(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true },
    );
  }

  //   check for available username
  async checkUserNameAvailability(username: string): Promise<boolean> {
    const usernameExists = await User.findOne({ username: username });
    return usernameExists ? true : false;
  }

  // password reset
  async findUserAndResetPassword(
    userId: Types.ObjectId,
    hashedPassword: string,
  ): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true, runValidators: false },
    );
    if (!user) return null;
    return user;
  }

  // update profile
  async updateProfileById(
    userInput: { username?: string; password?: string },
    userId: Types.ObjectId,
  ): Promise<IUser> {
    return (await User.findByIdAndUpdate(
      userId,
      {
        ...userInput,
      },
      { new: true },
    )) as IUser;
  }
}
