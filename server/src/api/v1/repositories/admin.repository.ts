import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import { IRole } from "@/types/role.types";
import { IUser } from "@/types/user.types";
import { InternalServerError } from "@/utils/AppError";
import { logger } from "@/utils/logger";

export class AdminRepository {
  async manageAccountStatus(
    userId: Types.ObjectId,
    status: boolean,
  ): Promise<IUser | null> {
    try {
      const data = await User.findByIdAndUpdate(
        userId,
        {
          isAccountActive: status,
        },
        { new: true },
      );
      return data;
    } catch {
      throw new InternalServerError("Operation failed!");
    }
  }

  async deleteUser(userId: Types.ObjectId): Promise<IUser | null> {
    try {
      const data = await User.findByIdAndDelete(userId);
      return data;
    } catch {
      throw new InternalServerError("Operation failed!");
    }
  }
  async getAllUsers(): Promise<IUser[]> {
    try {
      const role = (await Role.findOne({ name: "admin" })) as IRole;
      const roleId = role._id as Types.ObjectId;

      // get all users except admin itself
      const data = (await User.find({ role: { $ne: roleId } }).select(
        "-password",
      )) as IUser[];

      return data;
    } catch (error) {
      logger.error("Error fetching users!", error);
      throw new InternalServerError("Operation failed!");
    }
  }
}
