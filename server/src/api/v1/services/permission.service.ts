import { Types } from "mongoose";

import { permissionRepository } from "@/api/v1/repositories/permission.repository";
import {
  IPermission,
  PermissionAction,
  PermissionResource,
} from "@/types/permission.types";
import { BadRequestError } from "@/utils/AppError";

// permission service object
export const permissionService = {
  verifyPermission: async (
    permission: string,
    resource: string,
    roleId: Types.ObjectId,
  ): Promise<boolean> => {
    if (!permission) throw new BadRequestError("Permission not provided.");
    if (!resource) throw new BadRequestError("Resource is not provided.");

    const role = await permissionRepository.getPermissionById(roleId);

    if (!role) throw new BadRequestError("Role not found.");

    const hasAccess = (role?.permissions as IPermission[]).some(
      (per: IPermission) =>
        per.resource.includes(resource as PermissionResource) &&
        per.action.includes(permission as PermissionAction),
    );

    if (!hasAccess)
      throw new BadRequestError(
        "You are not authorized to perform this action.",
      );

    return hasAccess;
  },
};
