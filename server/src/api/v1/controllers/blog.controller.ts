import { Request, Response } from "express";

import { BlogService } from "@/api/v1/services/blog.service";
import { BlogInput } from "@/api/v1/validators/blog.schema";
import { ResponseHelper } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const blogService = new BlogService();

export const createBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as BlogInput;
    const blogImage = req.file as Express.Multer.File;

    const result = await blogService.createBlog(input, blogImage);

    return ResponseHelper.created(res, "Blog created successfully", result);
  },
);
