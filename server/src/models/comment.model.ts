import mongoose, { Schema } from "mongoose";

import { CommentDocument } from "@/types/comment.types";

const commentschema = new Schema<CommentDocument>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentschema);
