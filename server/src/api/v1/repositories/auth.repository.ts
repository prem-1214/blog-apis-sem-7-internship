import { Types } from "mongoose";

import { userMapper } from "@/mappers/user.mapper";
import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import { profileUpdateSchemaType } from "@/schemas/profileUpdateSchema";
import { IUser, UserResponseDTO } from "@/types/user.types";
import { AppError } from "@/utils/AppError";

// user repository class
export class AuthRepository {
  // find user by _id
  async findById(_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById({ _id: _id });
  }

  // find user by email
  async findByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = (await User.findOne({ email: email })) as IUser;
    if (!user) return null;
    return userMapper(user);
  }

  //   create user
  async createUser(userData: Partial<IUser>): Promise<UserResponseDTO> {
    try {
      const defaultRole = await Role.findOne({ name: "user" });

      const user = new User({
        ...userData,
        isEmailVarified: true,
        isAccountActive: true,
        role: defaultRole?._id,
      });

      const savedUser = await user.save();
      return userMapper(savedUser);
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

  //   check for available userName
  async checkUserNameAvailability(userName: string): Promise<boolean> {
    const userNameExists = await User.findOne({ userName: userName });
    return userNameExists ? true : false;
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
    userInput: profileUpdateSchemaType,
    userId: Types.ObjectId,
  ): Promise<UserResponseDTO> {
    const updatedUser = (await User.findByIdAndUpdate(
      userId,
      {
        ...userInput,
      },
      { new: true },
    )) as IUser;
    return userMapper(updatedUser);
  }
}
