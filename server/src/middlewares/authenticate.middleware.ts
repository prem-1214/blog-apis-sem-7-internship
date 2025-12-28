import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { cacheService } from "@/api/v1/services/cache.service";
import { config } from "@/config/config";
import { User } from "@/models/user.model";
import { UserDocument } from "@/types/user.types";
import { UnauthorizedError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { logger } from "@/utils/logger";

interface DecodedTokenPayload extends jwt.JwtPayload {
  _id: Types.ObjectId;
  email: string;
  role: Types.ObjectId;
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.error("Token not provided");
      throw new UnauthorizedError("Unauthorized Access ! token not provided");
    }

    const decodedToken = jwt.verify(
      token,
      config.get("ACCESS_TOKEN_SECRET"),
    ) as DecodedTokenPayload;

    if (!decodedToken)
      throw new UnauthorizedError("Unauthorized Access ! token not provided");

    const userIdStr = String(decodedToken._id);
    const cacheKey = `user:${userIdStr}`;

    const cachedUser = await cacheService.getCache<UserDocument>(cacheKey);

    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    const user = (await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    )) as UserDocument;

    if (!user) throw new UnauthorizedError("Unauthorized, User not found.");

    const userObj =
      typeof user.toObject === "function" ? user.toObject() : user;
    await cacheService.setCache(cacheKey, userObj, 60 * 10);

    req.user = user;
    next();
  },
);
