import { Types } from "mongoose";

import { profileUpdateSchemaType } from "@/api/v1/validators/profileUpdateSchema";
import { userMapper } from "@/mappers/user.mapper";
import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import { UserDocument, UserResponseDTO } from "@/types/user.types";
import { AppError } from "@/utils/AppError";

const FIELD_SETS = {
  public: "_id userName email firstName lastName",
  profile: "_id userName email firstName lastName blogs isAccountActive",
  full: "-password -refreshToken",
};

// auth repository object
export const authRepository = {
  // find user by _id
  findById: async (_id: Types.ObjectId): Promise<UserDocument | null> => {
    return await User.findById({ _id: _id });
  },

  // find user by email
  findByEmailForAuth: async (email: string): Promise<UserDocument | null> => {
    const user = await User.findOne({ email: email });
    if (!user) return null;
    return user;
  },

  // find user by email (public fields only)
  findByEmail: async (email: string): Promise<UserDocument | null> => {
    return await User.findOne({ email: email }).select(FIELD_SETS.public);
  },

  // create user
  createUser: async (
    userData: Partial<UserDocument>,
  ): Promise<UserResponseDTO> => {
    try {
      console.log("createUser: Starting...", userData);

      const defaultRole = await Role.findOne({ name: "user" });
      console.log("createUser: Found role:", defaultRole);

      if (!defaultRole) {
        throw new AppError("Default 'user' role not found in database", 400);
      }

      const user = new User({
        ...userData,
        isEmailVarified: true,
        isAccountActive: true,
        role: defaultRole._id,
      });
      console.log("createUser: User object created");

      const savedUser = await user.save();
      console.log("createUser: User saved successfully");

      return userMapper(savedUser);
    } catch (error) {
      console.error("createUser error:", error);
      throw new AppError("Error creating user", 400);
    }
  },

  // update refreshtoken in DB
  updateRefreshToken: async (
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<UserDocument | null> => {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true },
    );
  },

  // check for available userName
  checkUserNameAvailability: async (userName: string): Promise<boolean> => {
    const userNameExists = await User.findOne({ userName: userName });
    return userNameExists ? true : false;
  },

  // password reset
  findUserAndResetPassword: async (
    userId: Types.ObjectId,
    hashedPassword: string,
  ): Promise<UserDocument | null> => {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true, runValidators: false },
    );
    if (!user) return null;
    return user;
  },

  // update profile
  updateProfileById: async (
    userInput: profileUpdateSchemaType,
    userId: Types.ObjectId,
  ): Promise<UserResponseDTO> => {
    const updatedUser = (await User.findByIdAndUpdate(
      userId,
      {
        ...userInput,
      },
      { new: true },
    )) as UserDocument;
    return userMapper(updatedUser);
  },
};
