import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { IPermission } from "@/types/permission.types";
import { IRole } from "@/types/role.types";

// permission repository object
export const permissionRepository = {
  getPermissionById: async (
    roleId: Types.ObjectId,
  ): Promise<(IRole & { permissions: IPermission[] }) | null> => {
    const data = await Role.findById(roleId)
      .populate<{ permissions: IPermission[] }>("permissions")
      .exec();
    return data;
  },
};
