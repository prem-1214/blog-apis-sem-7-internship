import * as z from "zod";

export const loginSchema = z.object({
    userName: z.string().min(3).refine((value) => value !== "", "Username is required"),
    email: z.string().min(3).refine((value) => value !== "", "Email is required"),
    password: z.string().min(8).refine((value) => value !== "", "Password is required"),
});

export const registerSchema = z.object({
    userName: z.string().min(3).refine((value) => value !== "", "Username is required"),
    password: z.string().min(8).refine((value) => value !== "", "Password is required"),
    firstName: z.string().min(3).refine((value) => value !== "", "First name is required"),
    lastName: z.string().min(3).refine((value) => value !== "", "Last name is required"),
    email: z.string().min(3).refine((value) => value !== "", "Email is required"),
})

export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;