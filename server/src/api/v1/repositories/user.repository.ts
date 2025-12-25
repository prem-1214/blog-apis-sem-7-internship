import { Types } from "mongoose";

import { User } from "@/models/user.model";
import { IUser } from "@/types/user.types";

export class UserRepository {
  async findById(id: Types.ObjectId): Promise<IUser | null> {
    return User.findById(id);
  }
}
