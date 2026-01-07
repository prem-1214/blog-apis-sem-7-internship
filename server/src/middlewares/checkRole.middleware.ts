import { NextFunction, Request, Response } from "express";

import { roleService } from "@/api/v1/services/role.service";
import { ForbiddenError, UnauthorizedError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

export const checkRole = (role: string) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const roleId = req.user.role;

    if (!req.user || !roleId) throw new ForbiddenError("Access denied");

    const userRole = await roleService.checkRoleById(roleId, role);

    if (!userRole)
      throw new UnauthorizedError(
        "Unauthorized ! you do not have enough permissions to access this service",
      );

    next();
  });
