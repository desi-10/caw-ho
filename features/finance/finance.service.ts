import { ApiError } from "@/utils/api-error";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/api-response";
import { TypeFinance } from "./finance.validator";
import { prisma } from "@/utils/db";
import { findFinanceById } from "./finance.util";

export const getAllFinaces = async () => {
  const finances = await prisma.finance.findMany({
    orderBy: { date: "desc" },
  });
  return apiResponse("Finances fetched successfully", finances);
};

export const createFinance = async (data: TypeFinance) => {
  const existingFinance = await prisma.finance.findFirst({
    where: {
      OR: [{ receiptUrl: data.receiptUrl }, { reference: data.reference }],
    },
  });

  if (existingFinance)
    throw new ApiError(StatusCodes.CONFLICT, "Finance already exist");

  const finance = await prisma.finance.create({
    data,
  });

  return apiResponse("Finance created successfully", finance);
};

export const getFinanceById = async (id: string) => {
  const finance = await findFinanceById(id);

  if (!finance) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Finance not found");
  }

  return apiResponse("Finance fetched successfully", finance);
};
