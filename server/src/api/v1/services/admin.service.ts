import { Types } from "mongoose";

import { AdminRepository } from "@/api/v1/repositories/admin.repository";
import { IUser } from "@/types/user.types";
import {
  BadRequestError,
  InternalServerError,
  NOTFoundError,
} from "@/utils/AppError";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async manageAccountStatus(userId: string, status: boolean): Promise<IUser> {
    try {
      if (!Types.ObjectId.isValid(userId))
        throw new BadRequestError("Invalid user id");

      const id = new Types.ObjectId(userId);
      const result = await this.adminRepository.manageAccountStatus(id, status);

      if (!result) throw new NOTFoundError("User not found!");

      if (result.isAccountActive !== status) {
        return result;
      }
      throw new InternalServerError("Failed to update account status!");
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error updating account status!");
    }
  }

  async deleteUser(userId: string): Promise<IUser> {
    try {
      if (!Types.ObjectId.isValid(userId))
        throw new BadRequestError("Invalid user id");

      const id = new Types.ObjectId(userId);
      const result = await this.adminRepository.deleteUser(id);

      if (!result) throw new NOTFoundError("User not found!");

      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error deleting user!");
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const data = await this.adminRepository.getAllUsers();
      if(!data) throw new NOTFoundError("Users not found!");
      return data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new InternalServerError("Error fetching users!");
    }
  }
}
