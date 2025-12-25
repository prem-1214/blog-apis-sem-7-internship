import { Request, Response } from "express";

import { AdminService } from "@/api/v1/services/admin.service";
import { ResponseHelper } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const adminService = new AdminService();

export const manageAccountStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const status = req.body.status as boolean;

    const result = await adminService.manageAccountStatus(userId, status);

    return ResponseHelper.ok(res, "Account status updated successfully", result);
  },
);

export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    const result = await adminService.deleteUser(userId);

    return ResponseHelper.ok(res, "User deleted successfully", result);
  },
);

export const getAllUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    return ResponseHelper.ok(res, "Users fetched successfully", result);
  },
);
