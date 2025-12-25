import { Document } from "mongoose";

export interface IComment extends Document {
  blogId: string;
  userId: string;
  content: string;
}
