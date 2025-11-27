import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as memberService from "@/features/members/members.services";
import { MemberDataSchema } from "@/validators/members";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofMemberData } from "@/validators/members";

export const GET = asyncHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const result = await memberService.getMembers(page, limit);
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequestFormData(req, MemberDataSchema);
  const result = await memberService.createMember(data as TypeofMemberData);
  return NextResponse.json(result);
});
