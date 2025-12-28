import { Types } from "mongoose";

import { userMapper } from "@/mappers/user.mapper";
import { User } from "@/models/user.model";
import { UserDocument, UserResponseDTO } from "@/types/user.types";

// user repository object
export const userRepository = {
  findById: async (id: Types.ObjectId): Promise<UserResponseDTO | null> => {
    const user = (await User.findById(id)) as UserDocument;
    if (!user) return null;
    return userMapper(user);
  },
};
