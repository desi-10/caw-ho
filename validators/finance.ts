import { z } from "zod";

export const FinanceDataSchema = z.object({
  type: z.enum(["TITHE", "OFFERING", "DONATION", "EXPENSE", "PLEDGE"]),
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["GHS", "USD", "EUR"]).optional().default("GHS"),
  paymentType: z
    .enum(["CASH", "MOBILE_MONEY", "BANK"])
    .optional()
    .default("CASH"),
  status: z
    .enum(["PENDING", "COMPLETED", "CANCELLED"])
    .optional()
    .default("COMPLETED"),
  date: z.coerce.date().optional().default(new Date()),
  memberId: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  reference: z.string().optional(),
  reconciled: z.boolean().optional(),
  receiptUrl: z.string().optional(),
  fund: z.string().optional(),
  notes: z.string().optional(),
});

export type TypeofFinanceData = z.input<typeof FinanceDataSchema>;
