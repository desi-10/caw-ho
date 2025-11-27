import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as memberService from "@/features/members/members.services";
import { MemberDataSchema } from "@/validators/members";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofMemberData } from "@/validators/members";

export const GET = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await memberService.getMemberById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await validateRequestFormData(req, MemberDataSchema.partial());
    const result = await memberService.updateMember(
      id,
      data as Partial<TypeofMemberData>
    );
    return NextResponse.json(result);
  }
);

export const DELETE = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await memberService.deleteMember(id);
    return NextResponse.json(result);
  }
);
