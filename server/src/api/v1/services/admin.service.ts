import { Types } from "mongoose";

import { adminRepository } from "@/api/v1/repositories/admin.repository";
import { UserDocument } from "@/types/user.types";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/utils/AppError";

// admin service object
export const adminService = {
  manageAccountStatus: async (
    userId: string,
    status: boolean,
  ): Promise<UserDocument> => {
    try {
      if (!Types.ObjectId.isValid(userId))
        throw new BadRequestError("Invalid user id");

      const id = new Types.ObjectId(userId);
      const result = await adminRepository.manageAccountStatus(id, status);

      if (!result) throw new NotFoundError("User not found!");

      if (result.isAccountActive !== status) {
        return result;
      }
      throw new InternalServerError("Failed to update account status!");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error updating account status!");
    }
  },

  deleteUser: async (userId: string): Promise<UserDocument> => {
    try {
      if (!Types.ObjectId.isValid(userId))
        throw new BadRequestError("Invalid user id");

      const id = new Types.ObjectId(userId);
      const result = await adminRepository.deleteUser(id);

      if (!result) throw new NotFoundError("User not found!");

      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error deleting user!");
    }
  },

  getAllUsers: async (): Promise<UserDocument[]> => {
    try {
      const data = await adminRepository.getAllUsers();
      if (!data) throw new NotFoundError("Users not found!");
      return data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error fetching users!");
    }
  },
};
