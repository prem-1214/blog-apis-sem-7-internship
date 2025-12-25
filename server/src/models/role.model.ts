import mongoose, { Schema } from "mongoose";

import { IRole } from "@/types/role.types";
import "@/models/permission.model"

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      default: "User",
    },
    description: {
      type: String,
      required: false,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true },
);

export const Role = mongoose.model<IRole>("Role", roleSchema);
