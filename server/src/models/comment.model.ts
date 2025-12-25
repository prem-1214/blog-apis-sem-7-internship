import mongoose, { Schema } from "mongoose";

import { IComment } from "@/types/comment.types";

const commentschema = new Schema<IComment>(
  {
    blogId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model<IComment>("Comment", commentschema);
