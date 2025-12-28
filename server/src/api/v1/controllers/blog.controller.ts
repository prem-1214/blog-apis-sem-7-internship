import { Request, Response } from "express";

import { blogService } from "@/api/v1/services/blog.service";
import { BlogInput } from "@/api/v1/validators/blog.schema";
import { SuccessMessages } from "@/constants/successMessage";
import { successResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const createBlogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as BlogInput;
    const blogImage = req.file as Express.Multer.File;

    const result = await blogService.createBlog(input, blogImage);

    const response = successResponse(result, {
      message: SuccessMessages.CREATED("Blog"),
    });

    return res.status(201).json(response);
  },
);
