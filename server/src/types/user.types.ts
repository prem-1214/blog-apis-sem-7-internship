import { Document, Types } from "mongoose";

import { IBlog } from "@/types/blog.types";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
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
}
