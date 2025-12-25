import { BlogInput } from "@/api/v1/validators/blog.schema";
import { Blog } from "@/models/blog.model";
import { IBlog } from "@/types/blog.types";
import { InternalServerError } from "@/utils/AppError";

export class BlogRepository {
  async createBlog(
    input: BlogInput,
    blogImage: Express.Multer.File,
  ): Promise<IBlog> {
    try {
      const data = await Blog.create({
        ...input,
        blogImageUrl: blogImage.path,
      });
      return data;
    } catch {
      throw new InternalServerError("Blog creation failed");
    }
  }
}
