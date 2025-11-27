import { z } from "zod";

// --- Enums ---
export const FinanceTypeEnum = z.enum([
  "TITHE",
  "OFFERING",
  "DONATION",
  "EXPENSE",
  "PLEDGE",
]);

export const PaymentTypeEnum = z.enum(["CASH", "MOBILE_MONEY", "BANK"]);

export const FinanceStatusEnum = z.enum(["PENDING", "COMPLETED", "CANCELLED"]);

export const CurrencyEnum = z.enum(["GHS", "USD", "EUR"]);

// --- Finance Schema ---
export const financeSchema = z.object({
  id: z.string().cuid().optional(),

  type: FinanceTypeEnum,
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.number().positive("Amount must be greater than zero"),

  currency: CurrencyEnum.default("GHS"),
  paymentType: PaymentTypeEnum,
  status: FinanceStatusEnum.default("COMPLETED"),

  date: z.coerce.date().default(() => new Date()),

  memberId: z.string().cuid().optional().nullable(),
  approvedById: z.string().cuid().optional().nullable(),
  reference: z.string().optional().nullable(),
  reconciled: z.boolean().default(false),
  receiptUrl: z.string().url().optional().nullable(),
  fund: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),

  createdAt: z.coerce
    .date()
    .optional()
    .default(() => new Date()),
});

// --- Type Inference ---
export type TypeFinance = z.infer<typeof financeSchema>;
