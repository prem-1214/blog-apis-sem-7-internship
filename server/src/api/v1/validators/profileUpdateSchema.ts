import * as z from "zod";

export const profileUpdateSchema = z.object({
  userName: z.string().min(3).optional().refine((value) => value !== "", "Username is required"),
  password: z.string().min(8).optional().refine((value) => value !== "", "Password is required"),
  firstName: z.string().min(3).optional().refine((value) => value !== "", "First name is required"),
  lastName: z.string().min(3).optional().refine((value) => value !== "", "Last name is required"),
});

export type profileUpdateSchemaType = z.infer<typeof profileUpdateSchema>;