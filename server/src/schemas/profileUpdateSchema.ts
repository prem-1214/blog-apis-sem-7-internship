import * as z from "zod";

export const profileUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(8).optional(),
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
}).strict();

export type profileUpdateSchemaType = z.infer<typeof profileUpdateSchema>;