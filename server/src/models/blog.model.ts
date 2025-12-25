import mongoose, { Schema } from "mongoose";

import { IBlog } from "@/types/blog.types";

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
    },
    overView: {
      type: String,
    },
    bloggerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    blogStatus: {
      type: String,
      enum: ["visible", "hide"],
      default: "visible",
    },
    blogImageUrl: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true },
);

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
