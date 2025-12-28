import mongoose, { Schema } from "mongoose";

import { IPermission } from "@/types/permission.types";

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
    },
    action: {
      type: [String],
      required: true,
    },
    resource: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const Permission = mongoose.model<IPermission>(
  "Permission",
  permissionSchema,
);
