import { Document, Types } from "mongoose";

import { IBlog } from "@/types/blog.types";

export interface IUser extends Document {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Types.ObjectId;
  isAccountActive: boolean;
  isEmailVarified: boolean;
  isGoogleLogedIn: boolean;
  blogs: (Types.ObjectId | IBlog)[];
  refreshToken: string;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponseDTO {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Types.ObjectId;
  isAccountActive: boolean;
  isEmailVarified: boolean;
  isGoogleLogedIn: boolean;
  blogs: (Types.ObjectId | IBlog)[];
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
