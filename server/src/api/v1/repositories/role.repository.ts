import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { AppError } from "@/utils/AppError";

export class RoleRepository {
  async findById(roleId: Types.ObjectId) {
    try {
     const data = await Role.findById(roleId);
     return data?.name
    } catch {
      throw new AppError("Can not find Role", 500);
    }
  }
}
