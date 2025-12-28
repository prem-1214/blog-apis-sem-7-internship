import { Request, Response } from "express";

import { adminService } from "@/api/v1/services/admin.service";
import { SuccessMessages } from "@/constants/successMessage";
import { successResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const manageAccountStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const status = req.body.status as boolean;

    const result = await adminService.manageAccountStatus(userId, status);

    const response = successResponse(result, {
      message: SuccessMessages.UPDATED("Account status"),
    });

    return res.json(response);
  },
);

export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    const result = await adminService.deleteUser(userId);

    const response = successResponse(result, {
      message: SuccessMessages.DELETED("User"),
    });

    return res.json(response);
  },
);

export const getAllUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    const response = successResponse(result, {
      message: SuccessMessages.FETCHED("Users"),
    });

    return res.json(response);
  },
);
