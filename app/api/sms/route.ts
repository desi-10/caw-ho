import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as smsService from "@/features/sms/sms.services";
import { SMSDataSchema } from "@/validators/sms";
import { validateRequest } from "@/utils/validator-helper";
import { TypeofSMSData } from "@/validators/sms";

export const GET = asyncHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const result = await smsService.getScheduledSMS(page, limit);
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequest(req, SMSDataSchema);
  const result = await smsService.sendSMS(data as TypeofSMSData);
  return NextResponse.json(result);
});
