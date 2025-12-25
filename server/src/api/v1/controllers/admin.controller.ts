import { Request, Response } from "express";

import { AdminService } from "@/api/v1/services/admin.service";
import { asyncHandler } from "@/utils/asyncHandler";

const adminService = new AdminService();

export const manageAccountStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const status = req.body.status as boolean;

    const result = await adminService.manageAccountStatus(userId, status);

    res.status(200).json({
      status: "ok",
      message: "Account status updated successfully.",
      data: result,
    });
  },
);

export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    const result = await adminService.deleteUser(userId);

    res.status(200).json({
      status: "ok",
      message: "User deleted successfully.",
      data: result,
    });
  },
);

export const getAllUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    res.status(200).json({
      status: "ok",
      message: "Users fetched successfully.",
      data: result,
    });
  },
);
