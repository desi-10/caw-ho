import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as financeService from "@/features/finance/finance.services";
import { FinanceDataSchema } from "@/validators/finance";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofFinanceData } from "@/validators/finance";

export const GET = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await financeService.getFinanceById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await validateRequestFormData(
      req,
      FinanceDataSchema.partial()
    );
    const result = await financeService.updateFinance(
      id,
      data as Partial<TypeofFinanceData>
    );
    return NextResponse.json(result);
  }
);

export const DELETE = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await financeService.deleteFinance(id);
    return NextResponse.json(result);
  }
);
