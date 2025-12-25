import { NextFunction, Request, Response } from "express";

import { PermissionService } from "@/api/v1/services/permission.service";
import { BadRequestError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

export const authorize = (permission: string, resource: string) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const permissionService = new PermissionService();

    const roleId = req.user.role;

    const authorized = await permissionService.verifyPermission(
      permission,
      resource,
      roleId,
    );

    if (!authorized)
      throw new BadRequestError("not authorized to perform this action.");

    next();
  });
