import { Document, Types } from "mongoose";

import { IPermission } from "@/types/permission.types";

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: (Types.ObjectId | IPermission)[];
}
