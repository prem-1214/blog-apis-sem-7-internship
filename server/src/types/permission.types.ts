import { Document } from "mongoose";

export interface IPermission extends Document {
  name: string;
  action: string[];
  resources: string[];
}
