import { BlogRepository } from "@/api/v1/repositories/blog.repository";
import { cacheService } from "@/api/v1/services/cache.service";
import { BlogInput } from "@/api/v1/validators/blog.schema";
import { IBlog } from "@/types/blog.types";
import { BadRequestError, InternalServerError } from "@/utils/AppError";

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
  }

  async createBlog(
    input: BlogInput,
    blogImage: Express.Multer.File,
  ): Promise<IBlog> {
    try {
      if (!input.title || !input.description || !input.overview)
        throw new BadRequestError("All fields are required!");
      const data = await this.blogRepository.createBlog(input, blogImage);

      if (!data) throw new InternalServerError("Blog creation failed");

      cacheService.setCache(`blog:${data._id}`, data, 60 * 10);
      return data;
    } catch {
      throw new InternalServerError("Blog creation failed");
    }
  }
}
