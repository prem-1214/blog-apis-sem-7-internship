import { Types } from "mongoose";

import { userRepository } from "@/api/v1/repositories/user.repository";
import { cacheService } from "@/api/v1/services/cache.service";
import { UserResponseDTO } from "@/types/user.types";
import { InternalServerError } from "@/utils/AppError";

// user service object
export const userService = {
  getUserById: async (id: Types.ObjectId): Promise<UserResponseDTO | null> => {
    try {
      if (!Types.ObjectId.isValid(id))
        throw new InternalServerError("Invalid user id");

      const cacheKey = `user:${id}`;
      const cachedUser = await cacheService.getCache<UserResponseDTO>(cacheKey);

      if (cachedUser) return cachedUser;

      const user = await userRepository.findById(id);
      if (!user) return null;

      await cacheService.setCache(cacheKey, user, 60 * 10);
      return user;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error loading profile!");
    }
  },
};
