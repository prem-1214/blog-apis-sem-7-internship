import { Document, Types } from "mongoose";

export interface CommentDocument extends Document {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}
