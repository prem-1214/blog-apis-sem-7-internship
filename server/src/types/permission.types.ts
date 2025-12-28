import { Document } from "mongoose";

export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export enum PermissionResource {
  USER = "user",
  ROLE = "role",
  PERMISSION = "permission",
}

export interface IPermission extends Document {
  name: string;
  action: PermissionAction[];
  resource: PermissionResource;
}
