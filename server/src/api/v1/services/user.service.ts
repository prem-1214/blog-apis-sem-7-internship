import { Types } from "mongoose";

import { UserRepository } from "@/api/v1/repositories/user.repository";
import { cacheService } from "@/api/v1/services/cache.service";
import { IUser } from "@/types/user.types";
import { InternalServerError } from "@/utils/AppError";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: Types.ObjectId): Promise<IUser | null> {
    try {
      if (!Types.ObjectId.isValid(id))
        throw new InternalServerError("Invalid user id");

      const cacheKey = `user:${id}`;
      const cachedUser = await cacheService.getCache<IUser>(cacheKey);

      if (cachedUser) return cachedUser;

      const user = await this.userRepository.findById(id);
      if (!user) return null;

      await cacheService.setCache(cacheKey, user, 60 * 10);
      return user;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error loading profile!");
    }
  }
}
