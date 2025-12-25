import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import ms from "ms";

import { config } from "@/config/config";
import { IUser } from "@/types/user.types";

export function generateAccessToken(user: IUser): string {
  return jwt.sign(
    {
      _id: user._id as Types.ObjectId,
      email: user.email as string,
      role: user.role as Types.ObjectId,
    },
    config.get("ACCESS_TOKEN_SECRET") as string,
    {
      expiresIn: config.get("ACCESS_TOKEN_EXPIRY") as ms.StringValue,
    },
  );
}

export function generateRefreshToken(userId: Types.ObjectId): string {
  return jwt.sign(
    {
      _id: userId,
    },
    config.get("REFRESH_TOKEN_SECRET") as string,
    {
      expiresIn: config.get("REFRESH_TOKEN_EXPIRY") as ms.StringValue,
    },
  );
}
