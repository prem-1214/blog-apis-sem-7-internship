import { Types } from "mongoose";

import { Role } from "@/models/role.model";
import { AppError } from "@/utils/AppError";

// role repository object
export const roleRepository = {
  findById: async (roleId: Types.ObjectId) => {
    try {
      const data = await Role.findById(roleId);
      return data?.name;
    } catch {
      throw new AppError("Can not find Role", 500);
    }
  },
};
