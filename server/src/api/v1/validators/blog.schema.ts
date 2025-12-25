import * as z from "zod";

export const BlogSchema = z.object({
  title: z
    .string()
    .min(3, "Tile must be 3 characters long")
    .max(50, "Title must be 50 characters long"),
  description: z.string().max(500, "Description must be 500 characters long"),
  overview: z.string().max(500, "Overview must be 500 characters long"),
});

export type BlogInput = z.infer<typeof BlogSchema>;
