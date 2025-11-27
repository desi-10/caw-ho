import { z } from "zod";

export const SMSDataSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipients: z.array(z.string()).min(1, "At least one recipient is required"),
  scheduledFor: z.coerce.date().nullable().optional(),
  dayOfWeek: z
    .number()
    .min(0, "Day of week is required")
    .max(6, "Day of week is required"),
  isRecurring: z.boolean().default(false),
});

export type TypeofSMSData = z.infer<typeof SMSDataSchema>;
