import { prisma } from "@/utils/db";

export const findFinanceById = async (id: string) => {
  const finance = await prisma.finance.findFirst({
    where: { id },
  });

  return finance;
};

export const generateFinanceReference = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();

  // Get the latest finance record to increment the sequence
  const lastFinance = await prisma.finance.findFirst({
    orderBy: { createdAt: "desc" },
    select: { reference: true },
  });

  let nextNumber = 1;

  if (lastFinance?.reference) {
    // Extract the sequence number part if it matches the pattern
    const match = lastFinance.reference.match(/FIN-\d{4}-(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(6, "0");
  return `FIN-${currentYear}-${paddedNumber}`;
};
