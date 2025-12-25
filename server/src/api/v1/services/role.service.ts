import { Types } from "mongoose";

import { RoleRepository } from "@/api/v1/repositories/role.repository";
import { ForbiddenError } from "@/utils/AppError";

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async checkRoleById(roleId: Types.ObjectId, role: string): Promise<boolean> {
    const userRole = await this.roleRepository.findById(roleId);
    if (!userRole)
      throw new ForbiddenError(
        "Unauthorized! you are not authorized to use this service",
      );

    return userRole === role ? true : false;
  }

  async getRoleById(roleId: Types.ObjectId): Promise<string> {
    const userRole = await this.roleRepository.findById(roleId);
    if (!userRole)
      throw new ForbiddenError(
        "Unauthorized! you are not authorized to use this service",
      );

    return userRole;
  }
}
