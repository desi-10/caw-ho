import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as smsService from "@/features/sms/sms.services";
import { SMSDataSchema } from "@/validators/sms";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofSMSData } from "@/validators/sms";

export const GET = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await smsService.getScheduledSMSById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await validateRequestFormData(req, SMSDataSchema.partial());
    const result = await smsService.updateScheduledSMS(
      id,
      data as Partial<TypeofSMSData>
    );
    return NextResponse.json(result);
  }
);

export const DELETE = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await smsService.deleteScheduledSMS(id);
    return NextResponse.json(result);
  }
);
