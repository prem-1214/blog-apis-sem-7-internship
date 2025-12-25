import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { IRole } from "@/types/role.types";
import { IPermission } from "@/types/permission.types";

export class PermissionRepository {
  async getPermissionById(roleId: Types.ObjectId): Promise<(IRole & { permissions: IPermission[] }) | null> {
    const data = await Role.findById(roleId).populate<{permissions: IPermission[]}>("permissions").exec()
    return data;
  }
}
