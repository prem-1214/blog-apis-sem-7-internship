import bcrypt from "bcryptjs";
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema,
} from "mongoose";

import "@/models/role.model";
import { UserDocument } from "@/types/user.types";

const userSchema = new Schema<UserDocument>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 256,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 256,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    isAccountActive: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    isGoogleLogedIn: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  },
);

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
