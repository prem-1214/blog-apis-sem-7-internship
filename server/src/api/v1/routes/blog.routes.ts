import Router from "express";

import { createBlogHandler } from "@/api/v1/controllers/blog.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { checkRole } from "@/middlewares/checkRole.middleware";
import { upload } from "@/middlewares/multer.middleware";

const blogRouter = Router();

blogRouter.post(
  "/createblog",
  authenticate,
  checkRole("author"),
  authorize("create", "blog"),
  upload.single("blog-image"),
  createBlogHandler,
);

// blogRouter.put(
//   "/:id",

// )

export default blogRouter;
