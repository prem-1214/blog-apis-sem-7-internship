import { Types } from "mongoose";

import { PermissionRepository } from "@/api/v1/repositories/permission.repository";
import { IPermission } from "@/types/permission.types";
import { BadRequestError } from "@/utils/AppError";

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor() {
    this.permissionRepository = new PermissionRepository();
  }

  async verifyPermission(
    permission: string,
    resource: string,
    roleId: Types.ObjectId,
  ): Promise<boolean> {
    if (!permission) throw new BadRequestError("Permission not provided.");
    if (!resource) throw new BadRequestError("Resource is not provided.");

    const role = await this.permissionRepository.getPermissionById(roleId);

    if (!role) throw new BadRequestError("Role not found.");

  
    const hasAccess = (role?.permissions as IPermission[]).some(
      (per: IPermission) =>
        per.resources.includes(resource) && per.action.includes(permission),
    );

    if (!hasAccess)
      throw new BadRequestError(
        "You are not authorized to perform this action.",
      );

    return hasAccess;
  }
}
