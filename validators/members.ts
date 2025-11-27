import { z } from "zod";

export const MemberDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.any().optional(),
  userId: z.string().optional(),
});

export type TypeofMemberData = z.infer<typeof MemberDataSchema>;
