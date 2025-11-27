import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as financeService from "@/features/finance/finance.services";
import { FinanceDataSchema } from "@/validators/finance";
import { validateRequest } from "@/utils/validator-helper";
import { TypeofFinanceData } from "@/validators/finance";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { ApiError } from "@/utils/api-error";
import { StatusCodes } from "http-status-codes";

export const GET = asyncHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const result = await financeService.getFinances(page, limit);
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to create a finance"
    );
  }

  const data = await validateRequest(req, FinanceDataSchema);
  const result = await financeService.createFinance(
    data as TypeofFinanceData,
    user.user.id
  );
  return NextResponse.json(result);
});
