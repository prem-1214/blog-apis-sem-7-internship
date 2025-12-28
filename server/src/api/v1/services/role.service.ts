import { Types } from "mongoose";

import { roleRepository } from "@/api/v1/repositories/role.repository";
import { ForbiddenError } from "@/utils/AppError";

// role service object
export const roleService = {
  checkRoleById: async (
    roleId: Types.ObjectId,
    role: string,
  ): Promise<boolean> => {
    const userRole = await roleRepository.findById(roleId);
    if (!userRole)
      throw new ForbiddenError(
        "Unauthorized! you are not authorized to use this service",
      );

    return userRole === role ? true : false;
  },

  getRoleById: async (roleId: Types.ObjectId): Promise<string> => {
    const userRole = await roleRepository.findById(roleId);
    if (!userRole)
      throw new ForbiddenError(
        "Unauthorized! you are not authorized to use this service",
      );

    return userRole;
  },
};
