import { Types } from "mongoose";

import { userMapper } from "@/mappers/user.mapper";
import { User } from "@/models/user.model";
import { IUser, UserResponseDTO } from "@/types/user.types";

export class UserRepository {
  async findById(id: Types.ObjectId): Promise<UserResponseDTO | null> {
    const user = (await User.findById(id)) as IUser;
    if (!user) return null;
    return userMapper(user);
  }
}
