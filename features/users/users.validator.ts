import z from "zod";

export const UserDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "user"]),
  emailVerified: z.boolean().optional(),
  image: z.any().optional(),
});
export type TypeUserData = z.infer<typeof UserDataSchema>;
