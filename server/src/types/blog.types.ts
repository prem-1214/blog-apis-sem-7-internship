import { Types } from "mongoose";
import { Document } from "mongoose";

import { UserDocument } from "@/types/user.types";

export interface IBlog extends Document {
  title: string;
  description: string;
  overView: string;
  bloggerId: Types.ObjectId | UserDocument;
  isPublished: "draft" | "published";
  blogStatus: "visible" | "hide";
  blogImageUrl: string;
}
