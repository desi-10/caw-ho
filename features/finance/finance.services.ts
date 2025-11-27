import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { TypeofFinanceData } from "@/validators/finance";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import {
  FinanceType,
  PaymentType,
  FinanceStatus,
  Currency,
} from "@prisma/client";
// import { generateFinanceReference } from "./finance.util";

export const getFinances = async (page: number = 1, limit: number = 10) => {
  const finances = await prisma.finance.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      approvedBy: {
        select: {
          name: true,
        },
      },
      member: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalFinances = await prisma.finance.count();
  const totalPages = Math.ceil(totalFinances / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return apiResponse("Finances fetched successfully", {
    finances,
    pagination: {
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

export const createFinance = async (
  financeData: TypeofFinanceData,
  userId: string
) => {
  const {
    type,
    category,
    description,
    amount,
    currency,
    paymentType,
    status,
    date,
    memberId,
    firstname,
    lastname,
    reference,
    reconciled,
    receiptUrl,
    fund,
    notes,
  } = financeData;

  const existingFinance = await prisma.finance.findFirst({
    where: {
      reference,
    },
  });

  if (existingFinance) {
    throw new ApiError(StatusCodes.CONFLICT, "Finance already exists");
  }

  console.log(userId, "user");

  const finance = await prisma.finance.create({
    data: {
      type: type as FinanceType,
      category,
      description,
      amount,
      currency: (currency as Currency) || Currency.GHS,
      paymentType: paymentType as PaymentType,
      status: (status as FinanceStatus) || FinanceStatus.COMPLETED,
      date: date ? new Date(date as string) : new Date(),
      memberId: memberId || null,
      firstname,
      lastname,
      reference: reference || null,
      reconciled: reconciled || false,
      receiptUrl,
      fund,
      notes,
      approvedById: userId,
    },
  });

  return apiResponse("Finance created successfully", finance);
};

export const getFinanceById = async (id: string) => {
  const finance = await prisma.finance.findUnique({
    where: { id },
    include: {
      member: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!finance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Finance not found");
  }

  return apiResponse("Finance fetched successfully", finance);
};

export const updateFinance = async (
  id: string,
  financeData: Partial<TypeofFinanceData>
) => {
  const {
    type,
    category,
    description,
    amount,
    currency,
    paymentType,
    status,
    date,
    memberId,
    firstname,
    lastname,
    reference,
    reconciled,
    receiptUrl,
    fund,
    notes,
  } = financeData;

  const existingFinance = await prisma.finance.findUnique({
    where: { id },
  });

  if (!existingFinance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Finance not found");
  }

  const updatedFinance = await prisma.finance.update({
    where: { id },
    data: {
      type: type as FinanceType,
      category,
      description,
      amount,
      currency: currency as Currency,
      paymentType: paymentType as PaymentType,
      status: status as FinanceStatus,
      date: date ? new Date(date as string) : undefined,
      memberId: memberId || undefined,
      firstname,
      lastname,
      reference,
      reconciled,
      receiptUrl,
      fund,
      notes,
    },
  });

  return apiResponse("Finance updated successfully", updatedFinance);
};

export const deleteFinance = async (id: string) => {
  const existingFinance = await prisma.finance.findUnique({
    where: { id },
  });

  if (!existingFinance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Finance not found");
  }

  await prisma.finance.delete({
    where: { id },
  });

  return apiResponse("Finance deleted successfully", null);
};
