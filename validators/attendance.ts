import { z } from "zod";

export const AttendanceDataSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]).optional().default("PRESENT"),
  date: z.string().optional(),
  memberId: z.string().optional(),
});

export type TypeofAttendanceData = z.input<typeof AttendanceDataSchema>;
